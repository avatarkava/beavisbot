var PlugAPI = require('plugapi');
var fs = require('fs');
path = require('path')
var config = require(path.resolve(__dirname, 'config.json'));
var runCount = 0;

// Allow for hard-coding of the updateCode in case other methods are broken
if (config.updateCode != "") {
    console.log("Using update code: " + config.updateCode);
    runBot(false, config.botinfo.auth, config.updateCode);
}
else if (config.botinfo.auth != "") {
    console.log("Using auth key: " + config.botinfo.auth);
    PlugAPI.getUpdateCode(config.botinfo.auth, config.roomName, function (err, updateCode) {
        runBot(err, config.botinfo.auth, updateCode);
    });
}
else {
    PlugAPI.getAuth({
        username: config.botinfo.twitterUsername,
        password: config.botinfo.twitterPassword
    }, function (err, auth) { // if err is defined, an error occurred, most likely incorrect login
        if (err) {
            console.log("An error occurred: " + err);
            return;
        }

        PlugAPI.getUpdateCode(auth, config.roomName, function (err, updateCode) {
            runBot(err, auth, updateCode);
        });
    });
}

function runBot(error, auth, updateCode) {
    if(error) {
        console.log("An error occurred: " + err);
        return;
    } 
    
    initializeModules(auth, updateCode);
    
    bot.connect(config.roomName);

    bot.on('roomJoin', function(data) {    
        // Set up the room object
        room = data.room;
        
        console.log('Joined room', room);

        if (config.responses.botConnect !== "") {
            bot.chat(config.responses.botConnect);
        }
        if (room.media != null && config.wootSongs == 'ALL') {
            bot.upvote();
        }

        room.users.forEach(function(user) { addUserToDb(user); });

        lastRpcMessage = new Date();
    });

    bot.on('chat', function(data) {
        console.log('[CHAT] ' + data.from + ': ' + data.message);
        handleCommand(data);
        db.run('UPDATE USERS SET lastSeen = CURRENT_TIMESTAMP WHERE userid = ?', [data.fromID]);
    });
    
    bot.on('emote', function(data) {
        console.log('[EMTE] ' + data.from + ': ' + data.from + ' ' + data.message);
        handleCommand(data);
        db.run('UPDATE USERS SET lastSeen = CURRENT_TIMESTAMP WHERE userid = ?', [data.fromID]);
    });
    
    bot.on('user_join', function(data) {
        console.log('[JOIN] ' + data.username);

        var newUser = false;
        var message = "";

        if (data.username != config.botinfo.botname) {
            getUserFromDb(data, function (dbUser) {

                if (dbUser == undefined) {
                    message = config.responses.welcome.newUser.replace('{username}', data.username);
                    newUser = true;
                    if (config.fanNewUsers && data.relationship < 2) {
                        fanUser(data.id);
                    }
                }
                else {
                    message = config.responses.welcome.oldUser.replace('{username}', data.username);
                }

                if (newUser && message && (config.welcomeUsers == "NEW" || config.welcomeUsers == "ALL")) {
                    bot.chat(message);
                } else if (config.welcomeUsers == "ALL") {
                    // Don't welcome people repeatedly if they're throttling in and out of the room
                    db.get("SELECT strftime('%s', 'now')-strftime('%s', lastSeen) AS 'secondsSinceLastVisit', lastSeen FROM USERS WHERE userid = ?", [data.id] , function (error, row) {
                        if (row != null) {
                            console.log('[JOIN] ' + data.username + ' visited '+ row.secondsSinceLastVisit + ' seconds ago (' + row.lastSeen + ')');
                            if(row.secondsSinceLastVisit >= 300 && message) {
                                bot.chat(message);
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
    
    bot.on('user_leave', function(data) {
        console.log('User left: ', data);
        
        // Update DB
        db.run('UPDATE OR IGNORE USERS SET lastSeen = CURRENT_TIMESTAMP WHERE userid = ?', [data.id]);
        
        // Remove user from users list
        room.users.splice(_.pluck(room.users, 'id').indexOf(data.id), 1);
        
        lastRpcMessage = new Date();
    });
    
    bot.on('userUpdate', function(data) {
        console.log('User update: ', data);
        
        lastRpcMessage = new Date();
    });
    
    bot.on('curateUpdate', function(data) {
        console.log('[SNAG] ' + room.users.filter(function(user) { return user.id == data.id; })[0].username + ' snagged this song');
        
        room.curates[data.id] = true;
        
        lastRpcMessage = new Date();
    });
    
    bot.on('dj_advance', function(data) {
        //console.log('New song: ', JSON.stringify(data, null, 2));

        // Write previous song data to DB
        // But only if the last song actually existed
        if (room.media != null) {
            db.run('INSERT OR IGNORE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [room.media.id, room.media.title, room.media.format, room.media.author, room.media.cid, room.media.duration]);
                    
            db.run('INSERT INTO PLAYS (userid, songid, upvotes, downvotes, snags, started, listeners) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
                [room.currentDJ, 
                room.media.id, 
                _.values(room.votes).filter(function(vote) { return vote == 1; }).length, 
                _.values(room.votes).filter(function(vote) { return vote == -1; }).length, 
                _.values(room.curates).length, 
                room.users.length]);
        }
        
        // Update room object
        room.media = data.data.media;
        room.djs = data.data.djs;
        room.votes = {};
        room.mediaStartTime = data.data.mediaStartTime;
        room.currentDJ = data.data.currentDJ;
        room.playlistID = data.data.playlistID;
        room.historyID = data.data.historyID;
        room.curates = {}; 
        room.suggested = {};

        // Woot if it's set on ALL
        // @todo: Add support for other settings.
        if (room.media != null && config.wootSongs == 'ALL') {
            bot.upvote();
        }

        // DOL Checks
        if (room.media.author == 'U2') {
            bot.chat(':boom:');
        } else if (room.media.author == 'Extreme' || room.media.title == 'Winds of Change' || room.media.title == 'Under the Bridge') {
            bot.chat('What is this dreck?');
        }

        // Perform automatic song metadata correction
        if (room.media != null && config.autoSuggestCorrections) {
            correctMetadata();
        }
        
        lastRpcMessage = new Date();
    });
    
    bot.on('djUpdate', function(data) {
        //console.log('DJ update', JSON.stringify(data, null, 2));
        room.djs = data.djs;
        
        lastRpcMessage = new Date();
    });
    
    bot.on('update_votes', function(data) {
        console.log('[VOTE] ' + _.findWhere(room.users, {id: data.id}).username
            + ' voted ' + data.vote);
        
        // Log vote
        room.votes[data.id] = data.vote;

        // Check if bot needs to bop
        if (room.votes[bot.getSelf().id] == null) {
            
            upvotes = _.values(room.votes).filter(function(vote) { return vote == 1; }).length;
            target = room.users.length <= 3 ? 2 : Math.ceil(Math.pow(1.1383 * (room.users.length - 3), 0.6176));
            if (upvotes >= target) {
                bot.upvote();
            }
        }

        // Check if we prohibit mehing for DJs in Line
        if (config.prohibitMehInLine)
        for (i = 1; i < room.djs.length; i++) {
            dj = room.djs[i].user;
            if (room.votes[dj.id] == '-1') {
                bot.moderateRemoveDJ(dj.id);
                getUserFromDb(dj, function (dbUser) {
                    bot.chat('@' + dbUser.username + ', voting MEH while in line is prohibited.  Please check .rules for more info.');
                });

            }
        }
        
        lastRpcMessage = new Date();
    });

    if (config.requireWootInLine || config.activeDJTimeoutMins > 0) {
        setInterval(function () {
            monitorDJList();
        }, 5000);
    }

    function addUserToDb(user) {
        db.run('INSERT OR REPLACE INTO USERS VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', 
        [user.id,
        user.username,
        user.language,
        user.dateJoined.replace('T', ' '),
        user.avatarID]);
        db.run('INSERT OR IGNORE INTO DISCIPLINE VALUES(?, 0, 0, CURRENT_TIMESTAMP)', [user.id]);
    }

    function getUserFromDb(user, callback) {
        db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE userid = ?', [user.id], function (error, row) {
            callback(row);
        });
    }

    function getUserFromUsername(username, callback) {
        db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username], function (error, row) {
            callback(row);
        });
    }

    function monitorDJList() {
        //console.log(JSON.stringify(room.votes, null, 2));

        if (room.mediaStartTime) {

            startTime = new Date(room.mediaStartTime + ' GMT').getTime() / 1000;
            nowTime = new Date().getTime() / 1000;
            endTime = startTime + room.media.duration;
            remaining = endTime - nowTime;
            notWooting = [];

            // @todo - Add in flagging system so we warn one time but it can be *any* time < 60s
            if (config.requireWootInLine  && remaining <= 60 && remaining >= 55) {
                // Start at slot 1 (skip the current DJ)
                for (i = 1; i < room.djs.length; i++) {
                    dj = room.djs[i].user;
                    if (room.votes[dj.id] != '1') {
                        notWooting.push(dj.username);
                    }
                }
                if (notWooting.length > 0) {
                    notWootingList = notWooting.join(' @');
                    console.log('Not wooting: @' + notWootingList);
                    bot.chat('@' + notWootingList + ' ' + config.responses.wootReminder);
                }
            }
        }

    }

    function fanUser(user) {
        var request = require('request');
        request({
            uri: "http://plug.dj/_/gateway/user.follow",
            method: 'POST',
            form: {
                service: "user.follow",
                body: [user.id]
            }
        }, function (error, response, body) {
            console.log('[FAN] Added ' + user.username);
        });
    }

    function initializeModules(auth, updateCode) {
        // load context
        require(path.resolve(__dirname, 'context.js'))({auth: auth, updateCode: updateCode, config: config});
        
        // Allow bot to perform multi-line chat
        bot.multiLine = true;
        bot.multiLineLimit = 3;
        
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
        db.run('CREATE TABLE IF NOT EXISTS USERS (userid VARCHAR(255) PRIMARY KEY, username VARCHAR(255), language VARCHAR(10), dateJoined TIMESTAMP, avatarID VARCHAR(255), lastSeen TIMESTAMP)');
        
        db.run('CREATE TABLE IF NOT EXISTS SONGS (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), format VARCHAR(255), author VARCHAR(255), cid VARCHAR(255), duration DOUBLE)');
        
        db.run('CREATE TABLE IF NOT EXISTS PLAYS (id INTEGER PRIMARY KEY AUTOINCREMENT, userid VARCHAR(255), songid VARCHAR(255), upvotes INTEGER, downvotes INTEGER, snags INTEGER, started TIMESTAMP, listeners INTEGER)');

        db.run('CREATE TABLE IF NOT EXISTS THEMES (id INTEGER PRIMARY KEY AUTOINCREMENT, theme TEXT, userid VARCHAR(255), timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP);');
        
        db.run('CREATE TABLE IF NOT EXISTS CHAT (id INTEGER PRIMARY KEY AUTOINCREMENT, message VARCHAR(255), userid VARCHAR(255), timestamp TIMESTAMP)');

        db.run('CREATE TABLE IF NOT EXISTS GIFTS (id INTEGER PRIMARY KEY AUTOINCREMENT, category VARCHAR(255), name VARCHAR(255), chat TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        db.run('CREATE TABLE IF NOT EXISTS DISCIPLINE (userid VARCHAR(255) PRIMARY KEY, warns INTEGER, removes INTEGER, lastAction TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        db.run('CREATE TABLE IF NOT EXISTS CATFACTS (id integer PRIMARY KEY AUTOINCREMENT, fact varchar(255) NULL);');

        db.run('CREATE TABLE IF NOT EXISTS SCOTT_PILGRIM (id integer PRIMARY KEY AUTOINCREMENT, quote varchar(255) NULL);');

    }
    
    function handleCommand(data) {
        // unescape message
        data.message = S(data.message).unescapeHTML().s;
        
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
            //run command
            command.handler(data);
        }
    }
    
    function correctMetadata() {
        // first, see if the song exists in the db
        db.get('SELECT id FROM SONGS WHERE id = ?', [room.media.id], function(error, row) {
            if (row == null) {
                // if the song isn't in the db yet, check it for suspicious strings
                artistTitlePair = S((room.media.author + ' ' + room.media.title).toLowerCase());
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
                    suggestNewSongMetadata(room.media.author + ' ' + room.media.title);
                }
            }
        });
    }
    
    function suggestNewSongMetadata(valueToCorrect) {
        request('http://developer.echonest.com/api/v4/song/search?api_key=' + config.apiKeys.echoNest + '&format=json&results=1&combined=' + S(valueToCorrect).escapeHTML().stripPunctuation().s, function(error, response, body) {
            console.log('echonest body', body);
            if (error) {
                bot.chat('An error occurred while connecting to EchoNest.');
                console.log('EchoNest error', error);
            } else {
                response = JSON.parse(body).response;
                    
                room.media.suggested = {
                    author: response.songs[0].artist_name,
                    title: response.songs[0].title
                };
                
                // log
                console.log('[EchoNest] Original: "' + room.media.author + '" - "' + room.media.title + '". Suggestion: "' + room.media.suggested.author + '" - "' + room.media.suggested.title);
                
                if (room.media.author != room.media.suggested.author || room.media.title != room.media.suggested.title) {
                    bot.chat('Hey, the metadata for this song looks wrong! Suggested Artist: "' + room.media.suggested.author + '". Title: "' + room.media.suggested.title + '". Type ".fixsong yes" to use the suggested tags.');
                }
            }
        });
    }
    
    // Hack to make sure bot stays connected to plug
    // Every 15 seconds, check how much time has elapsed since the most recent RPC message.
    // If a song is playing and more than 15 seconds has passed since the expected end
    // of the song, stop the bot. If no song is playing and more than 30 minutes have passed
    // since an RPC event, stop the bot.
    if (config.stopBotOnConnectionLoss) {
        setInterval(function() {
            if (room.media != null && room.media.duration > 0) {
                if (new Date().getTime() - lastRpcMessage.getTime() > 15000 + (room.media.duration * 1000)) {
                    console.log('[IDLE] checking ' + (new Date().getTime() - lastRpcMessage.getTime()) + ' < '
                        + ((room.media.duration * 1000) + 15000));
                    console.log('[IDLE] Suspected connection loss at ' + new Date());
                    process.exit(1);
                }
            } else {
                if (new Date().getTime() - lastRpcMessage > 1800000) {
                    console.log('[IDLE] checking ' + (new Date().getTime() - lastRpcMessage.getTime()) + ' < '
                        + ((room.media.duration * 1000) + 15000));
                    console.log('[IDLE] Suspected connection loss at ' + new Date());
                    console.log('[IDLE] No song playing.');
                    process.exit(1);
                }
            }
        }, 15000);
    }
}
