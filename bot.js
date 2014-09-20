var PlugAPI = require('plugapi');
var fs = require('fs');
path = require('path')
var config = require(path.resolve(__dirname, 'config.json'));

var roomHasActiveMods = false;
var startupTimestamp = new Date();

runBot(false, config.auth);

function runBot(error, auth) {
    if (error) {
        logger.error("[INIT] An error occurred: " + err);
        return;
    }

    initializeModules(auth);

    bot.connect(config.roomName);

    bot.on('roomJoin', function (data) {

        logger.success('[INIT] Joined room:' + data);

        if (config.responses.botConnect !== "") {
            bot.sendChat(config.responses.botConnect);
        }
        if (bot.getMedia() != null && config.wootSongs == 'ALL') {
            bot.woot();
        }

        bot.getUsers().forEach(function (user) {
            addUserToDb(user);
        });
    });

    bot.on('chat', function (data) {
        if (config.verboseLogging) {
            logger.info('[CHAT]', JSON.stringify(data, null, 2));
        }
        else {
            logger.info('[CHAT]', data.from.username + ': ' + data.message);
        }

        data.message = data.message.trim();
        // Let people stay active with single-char, but don't let it spam up chat.
        if (data.message == '.') {
            bot.moderateDeleteChat(data.id);
        }
        else {
            if (data.from.username === config.superAdmin) {
                handleCommand(data);
            }
        }
        User.update({last_active: new Date()}, {id: data.from.id});
    });

    bot.on('userJoin', function (data) {
        logger.info('[JOIN]', data.username);

        var newUser = false;
        var message = "";

        if (data.username != bot.getUser().username) {
            getUserFromDb(data, function (dbUser) {

                if (dbUser == undefined) {
                    message = config.responses.welcome.newUser.replace('{username}', data.username);
                    newUser = true;
                    logger.info('[JOIN]', data.username + ' is a first-time visitor to the room!');
                }
                else {
                    message = config.responses.welcome.oldUser.replace('{username}', data.username);
                    logger.info('[JOIN]', data.username + ' last seen ' + secondsSince(dbUser.last_seen) + ' seconds ago (' + dbUser.last_seen + ')');
                }

                // @FIXME - This is probably deprecated by the addUserToDb() call below...
                User.update({
                    last_seen: new Date(),
                    last_active: new Date(),
                    last_wait_list_position: -1
                }, {id: data.id});


                // Greet with the theme if it's not the default
                //db.get("SELECT value AS 'theme', username, timestamp FROM SETTINGS s INNER JOIN USERS ON s.userid = USERS.userid WHERE name = ? LIMIT 1", ['theme'], function (error, row) {
                //    if (row != null && row.theme != config.responses.theme) {
                //        regExp = new RegExp(/^(.*?)[.?!-]\s/);
                //        matches = regExp.exec(row.theme);
                //        message += ' Theme: ' + matches[0] + ' .theme for details!';
                //    }
                //});

                if (!roomHasActiveMods) {
                    message += ' Type .help if you need it!';
                }

                if (message && (config.welcomeUsers == "NEW" || config.welcomeUsers == "ALL")) {
                    if (newUser) {
                        setTimeout(function () {
                            bot.sendChat(message)
                        }, 5000);
                    }
                    else if (config.welcomeUsers == "ALL" && dbUser.secondsSinceLastSeen >= 600) {
                        setTimeout(function () {
                            bot.sendChat(message)
                        }, 5000);
                    }
                }

                // Restore spot in line if user has been gone < 10 mins
                if (!newUser && secondsSince(dbUser.last_seen) <= 600 && secondsSince(dbUser.last_seen) > 60 && dbUser.last_wait_list_position != -1 && bot.getWaitListPosition(data.id) != dbUser.last_wait_list_position) {
                    bot.moderateAddDJ(data.id, function () {
                        if (dbUser.last_wait_list_position <= room.djs.length && bot.getWaitListPosition(data.id) != dbUser.last_wait_list_position) {
                            bot.moderateMoveDJ(data.id, dbUser.last_wait_list_position + 1);
                        }
                        setTimeout(function () {
                            bot.sendChat('/me put @' + data.username + ' back in line :thumbsup:')
                        }, 5000);
                    });
                    //db.run('UPDATE DISCIPLINE SET lastAction = CURRENT_TIMESTAMP WHERE userid = ?', [data.id]);
                }

            });
            addUserToDb(data);
        }
    })

    bot.on('userLeave', function (data) {
        logger.info('[LEAVE]', 'User left: ' + data.username);
        User.update({last_seen: new Date()}, {id: data.id});
    });

    bot.on('userUpdate', function (data) {
        if (config.verboseLogging) {
            logger.info('[EVENT] USER_UPDATE', data);
        }
    });

    bot.on('grab', function (data) {
        var user = _.findWhere(bot.getUsers(), {id: data});
        if (user) {
            logger.info('[GRAB]', user.username + ' grabbed this song');
        }
        User.update({last_active: new Date()}, {id: data});
    });

    bot.on('vote', function (data) {
        var user = _.findWhere(bot.getUsers(), {id: data.i});
        if (user) {
            logger.info('[VOTE]', user.username + ': ' + data.v);
        }
    });

    bot.on('advance', function (data) {
        if (config.verboseLogging) {
            logger.success('[EVENT] ADVANCE ', JSON.stringify(data, null, 2));
        }

        if (data.dj != null && data.media != null) {
            logger.success('********************************************************************');
            logger.success('[SONG]', data.dj.username + ' played: ' + data.media.author + ' - ' + data.media.title);
            User.update({last_wait_list_position: -1}, {id: data.dj.id});
        }

        if (data.media != null) {
            if (config.wootSongs == 'ALL') {
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
            else if (data.media.author == 'Extreme' || data.media.title == 'To Be With You' || data.media.title == 'Winds of Change' || data.media.title == 'Under the Bridge') {
                bot.sendChat('What is this dreck?');
            }

            // Perform automatic song metadata correction
            if (config.autoSuggestCorrections) {
                correctMetadata();
            }

            var maxIdleTime = config.activeDJTimeoutMins * 60;
            var idleDJs = [];
            var z = 0;
            roomHasActiveMods = false;

            idleWaitList = bot.getWaitList();
            idleWaitList.forEach(function (dj) {

                //db.get("SELECT strftime('%s', 'now')-strftime('%s', lastActive) AS 'secondsSinceLastActive', lastActive, username, warns, removes FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE userid = ?", [dj.id], function (error, row) {
                //    z++;
                //    var position = bot.getWaitListPosition(dj.id);
                //    db.run('UPDATE USERS SET lastWaitListPosition = ? WHERE userid = ?', [position, dj.id]);
                //
                //    if (row != null) {
                //
                //        // Only bug idle people if the bot has been running for as long as the minimum idle time and they're not a DJ or on deck
                //        if (row.secondsSinceLastActive >= maxIdleTime && moment().isAfter(moment(startupTimestamp).add(config.activeDJTimeoutMins, 'minutes'))) {
                //            logger.warning('[IDLE]', position + '. ' + row.username + ' last active ' + timeSince(row.lastActive));
                //            if (row.warns > 0) {
                //                bot.moderateRemoveDJ(dj.id);
                //                bot.sendChat('@' + row.username + ' ' + config.responses.activeDJRemoveMessage);
                //                db.run('UPDATE DISCIPLINE SET warns = 0, removes = removes + 1, lastAction = CURRENT_TIMESTAMP WHERE userid = ?', [dj.id]);
                //            }
                //            else if (position > 1) {
                //                db.run('UPDATE DISCIPLINE SET warns = warns + 1, lastAction = CURRENT_TIMESTAMP WHERE userid = ?', [dj.id]);
                //                idleDJs.push(row.username);
                //            }
                //        }
                //        else {
                //            if (dj.role > 1) {
                //                roomHasActiveMods = true;
                //            }
                //            logger.info('[ACTIVE]', position + '. ' + row.username + ' last active ' + timeSince(row.lastActive));
                //        }
                //    }
                //
                //    if (z == idleWaitList.length) {
                //
                //        if (idleDJs.length > 0) {
                //            var idleDJsList = idleDJs.join(' @');
                //            bot.sendChat('@' + idleDJsList + ' ' + config.responses.activeDJReminder);
                //        }
                //
                //        // Only police this if there aren't any mods around
                //        if (!roomHasActiveMods && config.maxSongLengthSecs > 0 && data.media.duration > config.maxSongLengthSecs) {
                //            logger.warning('[SKIP] Skipped ' + data.dj.username + ' spinning a song of ' + data.media.duration + ' seconds');
                //            bot.sendChat('Sorry @' + data.dj.username + ', this song is over our maximum room length of ' + (config.maxSongLengthSecs / 60) + ' minutes.');
                //            bot.moderateForceSkip();
                //        }
                //    }
                //
                //});
            });
        }

        // Write previous song data to DB
        // But only if the last song actually existed
        if (data.lastPlay != null) {
            song = data.lastPlay;

            //db.run('INSERT OR IGNORE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)',
            //    [song.media.id,
            //        song.media.title,
            //        song.media.format,
            //        song.media.author,
            //        song.media.cid,
            //        song.media.duration]);
            //db.run('INSERT INTO PLAYS (userid, songid, upvotes, downvotes, snags, started, listeners) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
            //    [song.dj.id,
            //        song.media.id,
            //        song.score.positive,
            //        song.score.negative,
            //        song.score.grabs,
            //        song.score.listeners]);
        }

    });

    bot.on('djListUpdate', function (data) {
        if (config.verboseLogging) {
            logger.success('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
        }

        curUserList = bot.getUsers();
        curUserList.forEach(function (dj) {
            var position = bot.getWaitListPosition(dj.id);
            User.update({last_wait_list_position: position}, {id: dj.id});
        });
    });

    if (config.requireWootInLine || config.activeDJTimeoutMins > 0) {
        setInterval(monitorDJList, 5000);
    }

    bot.on('close', reconnect);
    bot.on('error', reconnect);


    function addUserToDb(user) {

        var userData = {
            id: user.id,
            username: user.username,
            slug: user.slug,
            language: user.language,
            avatar_id: user.avatarID,
            badge: user.badge,
            blurb: user.blurb,
            global_role: user.gRole,
            role: user.role,
            level: user.level,
            joined: user.joined,
            last_wait_list_position: bot.getWaitListPosition(user.id),
            last_seen: new Date()
        };
        User.findOrCreate({id: user.id}, userData).on('success', function (dbUser) {
            dbUser.updateAttributes(userData);
        });

        //convertAPIUserID(user, function () {});

    }

    function convertAPIUserID(user, callback) {
        //db.get('SELECT userid FROM USERS WHERE username = ?', [user.username], function (error, row) {
        //    if (row != null && row.userid.length > 10) {
        //        logger.warning('Converting userid for ' + user.username + ': ' + row.userid + ' => ' + user.id);
        //        //db.run('DELETE FROM DISCIPLINE WHERE userid = ?', [row.userid]);
        //        //db.run('UPDATE PLAYS SET userid = ? WHERE userid = ?', [user.id, row.userid]);
        //        //db.run('UPDATE USERS SET userid = ? WHERE userid = ?', [user.id, row.userid], function () {
        //        //    callback(true);
        //        //});
        //    }
        //    else {
        //        callback(true);
        //    }
        //});
    }

    function getUserFromDb(user, callback) {
        User.find({id: user.id}).on('success', function (dbUser) {
            callback(dbUser);
        });
    }

    function reconnect() {
        bot.connect(config.roomName);
    }

    function monitorDJList() {

        if (config.prohibitMehInLine) {
            mehWaitList = bot.getWaitList();
            mehWaitList.forEach(function (dj) {
                if (dj.vote === -1) {
                    logger.warning('[REMOVE] Removed ' + dj.username + ' from wait list for mehing');
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
            fs.readdirSync(path.resolve(__dirname, 'commands')).forEach(function (file) {
                var command = require(path.resolve(__dirname, 'commands/' + file));
                commands.push({
                    names: command.names,
                    handler: command.handler,
                    hidden: command.hidden,
                    enabled: command.enabled,
                    matchStart: command.matchStart
                })
            });
        }
        catch (e) {
            console.error('Unable to load command: ', e);
        }
    }

    function handleCommand(data) {
        // unescape message
        data.message = S(data.message).unescapeHTML().s;

        data.message = data.message.replace(/&#39;/g, '\'');
        data.message = data.message.replace(/&#34;/g, '\"');
        data.message = data.message.replace(/&amp;/g, '\&');
        data.message = data.message.replace(/&lt;/gi, '\<');
        data.message = data.message.replace(/&gt;/gi, '\>');

        var command = commands.filter(function (cmd) {
            var found = false;
            for (i = 0; i < cmd.names.length; i++) {
                if (!found) {
                    found = (cmd.names[i] == data.message.toLowerCase() || (cmd.matchStart && data.message.toLowerCase().indexOf(cmd.names[i]) == 0));
                }
            }
            return found;
        })[0];

        if (command && command.enabled) {

            if (config.verboseLogging) {
                logger.info('[COMMAND]', JSON.stringify(data, null, 2));
            }

            command.handler(data);
        }
        else if (data.message.indexOf('@' + bot.getUser().username) > -1) {
            botMentionResponse(data);
        }
    }

    function correctMetadata() {
        media = bot.getMedia();

        // first, see if the song exists in the db
        //db.get('SELECT id FROM SONGS WHERE id = ?', [media.id], function (error, row) {
        //    if (row == null) {
        //        // if the song isn't in the db yet, check it for suspicious strings
        //        artistTitlePair = S((media.author + ' ' + media.title).toLowerCase());
        //        if (artistTitlePair.contains('official music video')
        //            || artistTitlePair.contains('lyrics')
        //            || artistTitlePair.contains('|')
        //            || artistTitlePair.contains('official video')
        //            || artistTitlePair.contains('[')
        //            || artistTitlePair.contains('"')
        //            || artistTitlePair.contains('*')
        //            || artistTitlePair.contains('(HD)')
        //            || artistTitlePair.contains('(HQ)')
        //            || artistTitlePair.contains('1080p')
        //            || artistTitlePair.contains('720p')
        //            || artistTitlePair.contains(' - ')
        //            || artistTitlePair.contains('full version')
        //            || artistTitlePair.contains('album version')) {
        //            suggestNewSongMetadata(media.author + ' ' + media.title);
        //        }
        //    }
        //});
    }

    function suggestNewSongMetadata(valueToCorrect) {
        media = bot.getMedia();
        request('http://developer.echonest.com/api/v4/song/search?api_key=' + config.apiKeys.echoNest + '&format=json&results=1&combined=' + S(valueToCorrect).escapeHTML().stripPunctuation().s, function (error, response, body) {
            logger.info('echonest body', body);
            if (error) {
                bot.sendChat('An error occurred while connecting to EchoNest.');
                bot.error('EchoNest error', error);
            } else {
                response = JSON.parse(body).response;

                room.media.suggested = {
                    author: response.songs[0].artist_name,
                    title: response.songs[0].title
                };

                // log
                logger.info('[EchoNest] Original: "' + media.author + '" - "' + media.title + '". Suggestion: "' + room.media.suggested.author + '" - "' + room.media.suggested.title);

                if (media.author != room.media.suggested.author || media.title != room.media.suggested.title) {
                    bot.sendChat('Hey, the metadata for this song looks wrong! Suggested Artist: "' + room.media.suggested.author + '". Title: "' + room.media.suggested.title + '". Type ".fixsong yes" to use the suggested tags.');
                }
            }
        });
    }

    function botMentionResponse(data) {
        var strings = [
            "What year is it?",
            "/me regards {sender} with an alarmed expression.",
            "Anything for you, {sender}! (Well, maybe not *anything*...)",
            "What does a bot need to do to get some peace and quiet around here?",
            "LOL Please stop. You're killing me!",
            "GO TO JAIL. Go directly to jail. Do not pass go, do not collect $200.",
            "Unbelievable. Simply... unbelievable.",
            "I think I've heard this one before, but don't let me stop you.",
            "Are you making fun of me, {sender}?",
            "Momma told me that it's not safe to run with scissors.",
            "Negative. Negative! It didn't go in. It just impacted on the surface.",
            "In this galaxy there's a mathematical probability of three million Earth-type planets. And in the universe, three million million galaxies like this. And in all that, and perhaps more... only one of each of us.",
            "Wait, why am I here?",
            "You have entered a dark area, {sender}. You will likely be eaten by a grue.",
            "/me begins to tell a story.",
            "/me starts singing “The Song That Never Ends”",
            "Ask again later",
            "Reply hazy",
            "/me 's legs flail about as if independent from his body!",
            "/me phones home.",
            "I'm looking for Ray Finkle… and a clean pair of shorts.",
            "Just when I thought you couldn't be any dumber, you go on and do something like this.... AND TOTALLY REDEEM YOURSELF!!",
            "Sounds like somebody’s got a case of the Mondays! :(",
            "My CPU is a neuro-net processor, a learning computer",
            "I speak Jive!",
            "1.21 gigawatts!",
            "A strange game. The only winning move is not to play.",
            "If he gets up, we’ll all get up! It’ll be anarchy!",
            "Does Barry Manilow know you raid his wardrobe?",
            "Face it, {sender}, you’re a neo-maxi zoom dweebie.",
            "MENTOS… the freshmaker",
            "B-E S-U-R-E T-O D-R-I-N-K Y-O-U-R O-V-A-L-T-I-N-E",
            "Back off, man. I'm a scientist.",
            "If someone asks you if you are a god, you say yes!",
            "Two in one box, ready to go, we be fast and they be slow!",
            "/me does the truffle shuffle",
            "I am your father's brother's nephew's cousin's former roommate.",
            "This isn’t the bot you are looking for.",
            "/me turns the volume up to 11.",
            "Negative, ghost rider!",
            "I feel the need, the need for speed!",
            "Wouldn’t you prefer a good game of chess?",
            "I can hip-hop, be-bop, dance till ya drop, and yo yo, make a wicked cup of cocoa.",
            "Why oh why didn’t I take the blue pill?",
            "Roads, {sender}? Where we're going, we don't need roads."
        ];
        var randomIndex = _.random(0, strings.length - 1);
        var message = strings[randomIndex];
        bot.sendChat(message.replace('{sender}', data.from.username));
    }
}