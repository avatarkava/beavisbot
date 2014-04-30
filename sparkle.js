var PlugAPI = require('plugapi');
var fs = require('fs');
path = require('path')
var config = require(path.resolve(__dirname, 'config.json'));
var runCount = 0;

if (config.botinfo.auth != "") {
    console.log("[INIT] Using auth key: " + config.botinfo.auth);
    runBot(false, config.botinfo.auth);
}
else {
    // @todo Set up plug-dj-login handling
}

function runBot(error, auth) {
    if(error) {
        console.log("[INIT] An error occurred: " + err);
        return;
    } 
    
    initializeModules(auth);
    
    bot.connect(config.roomName);

    bot.on('roomJoin', function(data) {

        bot.log('[INIT] Joined room:', data);

        if (config.responses.botConnect !== "") {
            bot.sendChat(config.responses.botConnect);
        }
        if (bot.getMedia() != null && config.wootSongs == 'ALL') {
            bot.woot();
        }

        bot.getUsers().forEach(function(user) { addUserToDb(user); });
        lastRpcMessage = new Date();
    });

    bot.on('chat', function(data) {
        bot.log('[CHAT] ' + data.from + ': ' + data.message);
        handleCommand(data);
        db.run('UPDATE USERS SET lastActive = CURRENT_TIMESTAMP WHERE userid = ?', [data.fromID]);
    });
    
    bot.on('emote', function(data) {
        bot.log('[EMTE] ' + data.from + ': ' + data.from + ' ' + data.message);
        handleCommand(data);
        db.run('UPDATE USERS SET lastActive = CURRENT_TIMESTAMP WHERE userid = ?', [data.fromID]);
    });
    
    bot.on('userJoin', function(data) {
        bot.log('[JOIN] ' + data.username);

        var newUser = false;
        var message = "";

        if (data.username != config.botinfo.botname) {
            getUserFromDb(data, function (dbUser) {

                if (dbUser == undefined) {
                    message = config.responses.welcome.newUser.replace('{username}', data.username);
                    newUser = true;
                }
                else {
                    message = config.responses.welcome.oldUser.replace('{username}', data.username);
                }

                if (newUser && message && (config.welcomeUsers == "NEW" || config.welcomeUsers == "ALL")) {
                    setTimeout(function(){ bot.sendChat(message) }, 5000);
                } else if (config.welcomeUsers == "ALL") {
                    // Don't welcome people repeatedly if they're throttling in and out of the room
                    db.get("SELECT strftime('%s', 'now')-strftime('%s', lastActive) AS 'secondsSinceLastActive', lastActive FROM USERS WHERE userid = ?", [data.id] , function (error, row) {
                        if (row != null) {
                            bot.log('[JOIN] ' + data.username + ' visited '+ row.secondsSinceLastActive + ' seconds ago (' + row.lastActive + ')');
                            if(row.secondsSinceLastActive >= 300 && message) {
                                setTimeout(function(){ bot.sendChat(message) }, 5000);
                                db.run('UPDATE USERS SET lastActive = CURRENT_TIMESTAMP WHERE userid = ?', [data.id]);
                            }
                        }
                    });
                }

                addUserToDb(data);
            });
        }
        else {
            addUserToDb(data);
        }
        
        room.users.push(data);
        
        lastRpcMessage = new Date();
    })
    
    bot.on('userLeave', function(data) {       
        bot.log('User left: ', data);
        db.run('UPDATE OR IGNORE USERS SET lastSeen = CURRENT_TIMESTAMP WHERE userid = ?', [data.id]);
        lastRpcMessage = new Date();
    });
    
    bot.on('userUpdate', function(data) {
        bot.log('User update: ', data);
        lastRpcMessage = new Date();
    });
    
    bot.on('curateUpdate', function(data) {
        bot.log('[GRAB]' + bot.getUsers().filter(function(user) { return user.id == data.id; })[0].username + ' grabbed this song');
        lastRpcMessage = new Date();
    });
    
    bot.on('djAdvance', function(data) {
        //bot.log('djAdvance: ', JSON.stringify(data, null, 2));
        bot.log('[SONG]', data.media.author + ' - ' + data.media.title);

        // Write previous song data to DB
        // But only if the last song actually existed
        if (data.lastPlay != null) {
            db.run('INSERT OR IGNORE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [data.lastPlay.media.id, data.lastPlay.media.title, data.lastPlay.media.format, data.lastPlay.media.author, data.lastPlay.media.cid, data.lastPlay.media.duration]);
                    
            db.run('INSERT INTO PLAYS (userid, songid, upvotes, downvotes, snags, started, listeners) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
                [data.lastPlay.dj.id,
                data.lastPlay.media.id,
                data.lastPlay.score.positive,
                data.lastPlay.score.negative,
                data.lastPlay.score.curates,
                data.lastPlay.score.listeners]);
        }

        // @todo: Add support for other settings - for now, woot if it's set on ALL
        if (data.media != null && config.wootSongs == 'ALL') {
            bot.woot();
        }

        // DOL Checks: Specific quirky bot messages (feel free to nuke)
        if (data.media.author == 'U2') {
            bot.sendChat(':boom:');
        }
        else if (data.media.author == 'Wing') {
            bot.sendChat('OH MY GOD MY EARS! :hear_no_evil:')
            bot.meh();
        }
        else if (data.media.author == 'Extreme' || data.media.title == 'Winds of Change' || data.media.title == 'Under the Bridge') {
            bot.sendChat('What is this dreck?');
        }

        // Perform automatic song metadata correction
        if (data.media != null && config.autoSuggestCorrections) {
            correctMetadata();
        }

        if (config.activeDJTimeoutMins > 0) {
            var maxIdleTime = config.activeDJTimeoutMins * 60;
            var idleDJs = [];
            var z = 0;

            waitlist = bot.getDJs().splice(1);
            waitlist.forEach(function(dj) {
                z++;
                db.get("SELECT strftime('%s', 'now')-strftime('%s', lastActive) AS 'secondsSinceLastActive', strftime('%s', lastActive) AS 'lastActive', username FROM USERS WHERE userid = ?", [dj.id] , function (error, row) {
                    if (row != null) {
                        if(row.secondsSinceLastActive >= maxIdleTime) {
                            bot.log('[IDLE] ' + row.username + ' last active '+ timeSince(row.lastActive) + ' ago');
                            idleDJs.push(row.username);
                        }
                        else {
                            bot.log('[ACTIVE] ' + row.username + ' last active '+ timeSince(row.lastActive) + ' ago');
                        }

                        if (z == waitlist.length && idleDJs.length > 0) {
                            var idleDJsList = idleDJs.join(' @');
                            bot.sendChat('@' + idleDJsList + ' ' + config.responses.activeDJReminder);
                        }
                    }
                });
            });
        }
        lastRpcMessage = new Date();
    });
    
    bot.on('djUpdate', function(data) {
        //bot.log('DJ update', JSON.stringify(data, null, 2));
        lastRpcMessage = new Date();
    });
    
    bot.on('voteUpdate', function(data) {
        bot.log('[VOTE] ' + _.findWhere(bot.getUsers(), {id: data.id}).username + ' voted ' + data.vote);
        lastRpcMessage = new Date();
    });

    if (config.requireWootInLine || config.activeDJTimeoutMins > 0) {
        setInterval(function () {
            monitorDJList();
        }, 5000);
    }

    bot.on('close', reconnect);
    bot.on('error', reconnect);

    function addUserToDb(user) {
        db.run('INSERT OR IGNORE INTO USERS VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        [user.id, user.username, user.language, user.dateJoined.replace('T', ' '), user.avatarID]);
        db.run('UPDATE USERS SET username = ?, language = ?, lastSeen = CURRENT_TIMESTAMP WHERE userid = ?', [user.username, user.language, user.id]);
        db.run('INSERT OR IGNORE INTO DISCIPLINE VALUES(?, 0, 0, CURRENT_TIMESTAMP)', [user.id]);

    }

    function getUserFromDb(user, callback) {
        db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE userid = ?', [user.id], function (error, row) {
            callback(row);
        });
    }

    function reconnect() {
        bot.connect(config.roomName);
    }

    function monitorDJList() {
        if (config.prohibitMehInLine) {
            waitlist = bot.getDJs().splice(1);
            waitlist.forEach(function(dj) {
                if (dj.vote == '-1') {
                    bot.moderateRemoveDJ(dj.id);
                    bot.sendChat('@' + dj.username + ', voting MEH/Chato/:thumbsdown: while in line is prohibited. Check .rules.');
                }
            });
        }
    }

    function initializeModules(auth) {
        // load context
        require(path.resolve(__dirname, 'context.js'))({auth: auth, config: config});
        
        // Allow bot to perform multi-line chat
        bot.multiLine = true;
        bot.multiLineLimit = 5;
        
        // Load commands
        try {
            fs.readdirSync(path.resolve(__dirname, 'commands')).forEach(function(file) {
                var command = require(path.resolve(__dirname, 'commands/' + file));
                commands.push({names: command.names,
                    handler: command.handler,
                    hidden: command.hidden,
                    enabled: command.enabled,
                    matchStart: command.matchStart
                })
            });
        } catch (e) {
            console.error('Unable to load command: ', e);
        }
        
        initializeDatabase();
    }
    
    function initializeDatabase() {
        db.run('CREATE TABLE IF NOT EXISTS USERS (userid VARCHAR(255) PRIMARY KEY, username VARCHAR(255), language VARCHAR(10), dateJoined TIMESTAMP, avatarID VARCHAR(255), lastSeen TIMESTAMP, lastActive TIMESTAMP)');
        db.run('CREATE TABLE IF NOT EXISTS SONGS (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), format VARCHAR(255), author VARCHAR(255), cid VARCHAR(255), duration DOUBLE)');
        db.run('CREATE TABLE IF NOT EXISTS PLAYS (id INTEGER PRIMARY KEY AUTOINCREMENT, userid VARCHAR(255), songid VARCHAR(255), upvotes INTEGER, downvotes INTEGER, snags INTEGER, started TIMESTAMP, listeners INTEGER)');
        db.run('CREATE TABLE IF NOT EXISTS SETTINGS (name VARCHAR(255) PRIMARY KEY, value TEXT, userid VARCHAR(255), timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP);');
        db.run('CREATE TABLE IF NOT EXISTS CHAT (id INTEGER PRIMARY KEY AUTOINCREMENT, message VARCHAR(255), userid VARCHAR(255), timestamp TIMESTAMP)');
        db.run('CREATE TABLE IF NOT EXISTS GIFTS (id INTEGER PRIMARY KEY AUTOINCREMENT, category VARCHAR(255), name VARCHAR(255), chat TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
        db.run('CREATE TABLE IF NOT EXISTS DISCIPLINE (userid VARCHAR(255) PRIMARY KEY, warns INTEGER, removes INTEGER, lastAction TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
        db.run('CREATE TABLE IF NOT EXISTS FACTS (id integer PRIMARY KEY AUTOINCREMENT, category VARCHAR(255), fact varchar(255) NULL);');
        db.run('CREATE TABLE IF NOT EXISTS SCOTT_PILGRIM (id integer PRIMARY KEY AUTOINCREMENT, quote varchar(255) NULL);');
    }
    
    function handleCommand(data) {
        // unescape message
        data.message = S(data.message).unescapeHTML().s;

        data.message = data.message.replace(/&#39;/g, '\'');
        data.message = data.message.replace(/&#34;/g, '\"');
        data.message = data.message.replace(/&amp;/g, '\&');
        data.message = data.message.replace(/&lt;/gi, '\<');
        data.message = data.message.replace(/&gt;/gi, '\>');
        
        var command = commands.filter(function(cmd) { 
            var found = false;
            for (i = 0; i < cmd.names.length; i++) {
                if (!found) {
                    found = (cmd.names[i] == data.message.toLowerCase() || (cmd.matchStart && data.message.toLowerCase().indexOf(cmd.names[i]) == 0));
                }
            }
            return found;
        })[0];
        
        if (command && command.enabled) {

            // @FIXME - not efficient, but convenient!
            room.djs = bot.getDJs();
            room.users = bot.getUsers();
            room.media = bot.getMedia();

            bot.log('[COMMAND]', JSON.stringify(data, null, 2));

            command.handler(data);
        }
    }
    
    function correctMetadata() {
        media = bot.getMedia();

        // first, see if the song exists in the db
        db.get('SELECT id FROM SONGS WHERE id = ?', [media.id], function(error, row) {
            if (row == null) {
                // if the song isn't in the db yet, check it for suspicious strings
                artistTitlePair = S((media.author + ' ' + media.title).toLowerCase());
                if (artistTitlePair.contains('official music video')
                  || artistTitlePair.contains('lyrics')
                  || artistTitlePair.contains('|')
                  || artistTitlePair.contains('official video')
                  || artistTitlePair.contains('[')
                  || artistTitlePair.contains('"')
                  || artistTitlePair.contains('*')
                  || artistTitlePair.contains('(HD)')
                  || artistTitlePair.contains('(HQ)')
                  || artistTitlePair.contains('1080p')
                  || artistTitlePair.contains('720p')
                  || artistTitlePair.contains(' - ')
                  || artistTitlePair.contains('full version')
                  || artistTitlePair.contains('album version')) {
                    suggestNewSongMetadata(media.author + ' ' + media.title);
                }
            }
        });
    }
    
    function suggestNewSongMetadata(valueToCorrect) {
        media = bot.getMedia();
        request('http://developer.echonest.com/api/v4/song/search?api_key=' + config.apiKeys.echoNest + '&format=json&results=1&combined=' + S(valueToCorrect).escapeHTML().stripPunctuation().s, function(error, response, body) {
            bot.log('echonest body', body);
            if (error) {
                bot.sendChat('An error occurred while connecting to EchoNest.');
                bot.log('EchoNest error', error);
            } else {
                response = JSON.parse(body).response;
                    
                room.media.suggested = {
                    author: response.songs[0].artist_name,
                    title: response.songs[0].title
                };
                
                // log
                bot.log('[EchoNest] Original: "' + media.author + '" - "' + media.title + '". Suggestion: "' + room.media.suggested.author + '" - "' + room.media.suggested.title);
                
                if (media.author != room.media.suggested.author || media.title != room.media.suggested.title) {
                    bot.sendChat('Hey, the metadata for this song looks wrong! Suggested Artist: "' + room.media.suggested.author + '". Title: "' + room.media.suggested.title + '". Type ".fixsong yes" to use the suggested tags.');
                }
            }
        });
    }
}
