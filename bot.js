var PlugAPI = require('plugapi');
var fs = require('fs');
path = require('path')
var config = require(path.resolve(__dirname, 'config.json'));

runBot(false, config.auth);

var roomHasActiveMods = false;
var startupTimestamp = moment.utc().toDate();

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

        bot.getUsers().forEach(function (user) {
            updateDbUser(user);
        });

    });

    bot.on('chat', function (data) {
        if (config.verboseLogging) {
            logger.info('[CHAT]', JSON.stringify(data, null, 2));
        }
        else if (data.from !== undefined && data.from !== null) {
            logger.info('[CHAT]', data.from.username + ': ' + data.message);
        }

        if (data.from !== undefined && data.from !== null) {
            data.message = data.message.trim();
            // Let people stay active with single-char, but don't let it spam up chat.
            if (data.message === '.') {
                bot.moderateDeleteChat(data.id);
            }
            else {
                handleCommand(data);
            }

            User.update({last_active: new Date(), last_seen: new Date()}, {where: {id: data.from.id}});
        }
    });

    bot.on('userJoin', function (data) {
        if (config.verboseLogging) {
            logger.info('[JOIN]', JSON.stringify(data, null, 2));
        }

        var newUser = false;
        var message = "";

        if (data.username !== bot.getUser().username) {
            User.find(data.id).on('success', function (dbUser) {

                if (dbUser === null) {
                    message = config.responses.welcome.newUser.replace('{username}', data.username);
                    newUser = true;
                    logger.info('[JOIN]', data.username + ' is a first-time visitor to the room!');
                }
                else {
                    message = config.responses.welcome.oldUser.replace('{username}', data.username);
                    logger.info('[JOIN]', data.username + ' last seen ' + timeSince(dbUser.last_seen));
                }

                // Greet with the theme if it's not the default
                RoomEvent.find({where: {type: 'theme', starts_at: {lte: new Date()}, ends_at: {gte: new Date()}}}).on('success', function (row) {
                    if (row !== null) {
                        message += ' Theme: ' + row.title + ' - .theme for details!';
                    }
                });

                if (!roomHasActiveMods) {
                    message += ' Type .help if you need it!';
                }

                if (message && (config.welcomeUsers == "NEW" || config.welcomeUsers == "ALL")) {
                    if (newUser) {
                        setTimeout(function () {
                            bot.sendChat(message)
                        }, 5000);
                    }
                    else if (config.welcomeUsers == "ALL" && secondsSince(dbUser.last_active) >= 900 && secondsSince(dbUser.last_seen) >= 900) {
                        setTimeout(function () {
                            bot.sendChat(message)
                        }, 5000);
                    }
                }

                // Restore spot in line if user has been gone < 15 mins
                var position = bot.getWaitListPosition(data.id);
                if (!newUser && dbUser.waitlist_position > -1 && secondsSince(dbUser.last_seen) <= 900 && (position === -1 || (position > -1 && position > dbUser.waitlist_position))) {
                    bot.moderateAddDJ(data.id, function () {
                        if (dbUser.waitlist_position < bot.getWaitList().length && position !== dbUser.waitlist_position) {
                            bot.moderateMoveDJ(data.id, dbUser.waitlist_position);
                            var userData = {
                                type: 'restored',
                                details: 'Restored to position ' + dbUser.waitlist_position + ' (disconnected for ' + timeSince(dbUser.last_seen) + ')',
                                user_id: data.id,
                                mod_user_id: bot.getUser().id
                            };
                            Karma.create(userData);
                        }
                        setTimeout(function () {
                            bot.sendChat('/me put @' + data.username + ' back in line :thumbsup:')
                        }, 5000);
                    });
                }

            });
            updateDbUser(data);
        }
    })

    bot.on('userLeave', function (data) {
        logger.info('[LEAVE]', 'User left: ' + data.username);
        User.update({last_seen: new Date()}, {where: {id: data.id}});
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
        User.update({last_active: new Date(), last_seen: new Date()}, {where: {id: data}});
    });

    bot.on('vote', function (data) {
        var user = _.findWhere(bot.getUsers(), {id: data.i});
        if (config.verboseLogging && user) {
            logger.info('[VOTE]', user.username + ': ' + data.v);
        }
    });

    bot.on('advance', function (data) {
        if (config.verboseLogging) {
            logger.success('[EVENT] ADVANCE ', JSON.stringify(data, null, 2));
        }

        saveWaitList();

        // Write previous play data to DB
        if (data.lastPlay.media !== null && data.lastPlay.dj !== null) {
            Play.create({
                user_id: data.lastPlay.dj.id,
                song_id: data.lastPlay.media.id,
                positive: data.lastPlay.score.positive,
                negative: data.lastPlay.score.negative,
                grabs: data.lastPlay.score.grabs,
                listeners: data.lastPlay.score.listeners,
                skipped: data.lastPlay.score.skipped
            });
        }

        if (data.media != null) {

            if (data.currentDJ != null) {
                logger.success('********************************************************************');
                logger.success('[UPTIME]', 'Bot online ' + timeSince(startupTimestamp, true));
                logger.success('[SONG]', data.currentDJ.username + ' played: ' + data.media.author + ' - ' + data.media.title);
            }

            // Perform automatic song metadata correction
            if (config.autoSuggestCorrections) {
                correctMetadata();
            }

            // Write current song data to DB
            var songData = {
                id: data.media.id,
                author: data.media.author,
                title: data.media.title,
                format: data.media.format,
                cid: data.media.cid,
                duration: data.media.duration,
                image: data.media.image
            };
            Song.findOrCreate({where: {id: data.media.id, cid: data.media.cid}, defaults: songData}).spread(function (song) {
                song.updateAttributes(songData);
            });

            if (config.wootSongs == 'ALL') {
                bot.woot();
            }

            SongResponse.find({
                where: Sequelize.or(
                    Sequelize.and({media_type: 'author', trigger: {like: data.media.author}, is_active: true}),
                    Sequelize.and({media_type: 'title', trigger: {like: data.media.title}, is_active: true})
                )
            }).on('success', function (row) {
                if (row !== null) {
                    if (row.response != '') {
                        bot.sendChat(row.response);
                    }
                    if (row.rate === 1) {
                        bot.woot();
                    }
                    else if (row.rate === -1) {
                        bot.meh();
                    }
                }
            });

            var maxIdleTime = config.activeDJTimeoutMins * 60;
            var idleDJs = [];
            var z = 0;
            roomHasActiveMods = false;

            idleWaitList = bot.getWaitList();
            idleWaitList.forEach(function (dj) {
                User.find(dj.id).on('success', function (dbUser) {

                    z++;

                    var position = bot.getWaitListPosition(dj.id);

                    if (dbUser !== null) {

                        // Only bug idle people if the bot has been running for as long as the minimum idle time
                        if (secondsSince(dbUser.last_active) >= maxIdleTime && moment.utc().isAfter(moment.utc(startupTimestamp).add(config.activeDJTimeoutMins, 'minutes'))) {
                            logger.warning('[IDLE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                            Karma.find({
                                where: {
                                    user_id: dj.id,
                                    type: 'warn',
                                    created_at: {gte: moment.utc().subtract(config.activeDJTimeoutMins, 'minutes').toDate()}
                                }
                            }).on('success', function (row) {

                                if (row != null) {
                                    bot.moderateRemoveDJ(dj.id);
                                    bot.sendChat('@' + dbUser.username + ' ' + config.responses.activeDJRemoveMessage);
                                    var userData = {
                                        type: 'remove',
                                        details: 'Removed from position ' + position + ': AFK for ' + timeSince(dbUser.last_active, true),
                                        user_id: dj.id,
                                        mod_user_id: bot.getUser().id
                                    };
                                    Karma.create(userData);
                                }
                                else if (position > 1) {
                                    var userData = {
                                        type: 'warn',
                                        details: 'Warned in position ' + position + ': AFK for ' + timeSince(dbUser.last_active, true),
                                        user_id: dj.id,
                                        mod_user_id: bot.getUser().id
                                    };
                                    Karma.create(userData);
                                    idleDJs.push(dbUser.username);
                                }
                            });
                        }
                        else {
                            if (dj.role > 1) {
                                roomHasActiveMods = true;
                            }
                            logger.info('[ACTIVE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                        }
                    }

                    if (z === idleWaitList.length) {

                        if (idleDJs.length > 0) {
                            var idleDJsList = idleDJs.join(' @');
                            bot.sendChat('@' + idleDJsList + ' ' + config.responses.activeDJReminder);
                        }

                        // Only police this if there aren't any mods around
                        if (!roomHasActiveMods && config.maxSongLengthSecs > 0 && data.media.duration > config.maxSongLengthSecs) {
                            logger.warning('[SKIP] Skipped ' + data.currentDJ.username + ' spinning a song of ' + data.media.duration + ' seconds');
                            bot.sendChat('Sorry @' + data.currentDJ.username + ', this song is over our maximum room length of ' + (config.maxSongLengthSecs / 60) + ' minutes.');
                            bot.moderateForceSkip();
                            var userData = {
                                type: 'skip',
                                details: 'Skipped for playing a song of ' + data.media.duration + ' (room configured for max of ' + config.maxSongLengthSecs + ')',
                                user_id: data.currentDJ.id,
                                mod_user_id: bot.getUser().id
                            };
                            Karma.create(userData);

                        }
                    }

                });
            });

        }

    });

    bot.on('djListUpdate', function (data) {
        if (config.verboseLogging) {
            logger.success('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
        }
        saveWaitList();
    });

    if (config.requireWootInLine || config.activeDJTimeoutMins > 0) {
        setInterval(monitorDJList, 5000);
    }

    bot.on('close', reconnect);
    bot.on('error', reconnect);


    function saveWaitList() {

        var userList = bot.getUsers();
        userList.forEach(function (user) {
            var position = bot.getWaitListPosition(user.id);
            // user last seen in 900 seconds
            if (position > 0) {
                User.update({waitlist_position: position, last_seen: moment.utc().toDate()}, {where: {id: user.id}});
            }
            else {
                User.update({waitlist_position: -1}, {where: {id: user.id}});
            }
            if (config.verboseLogging) {
                logger.info('Wait List Update', user.username + ' => ' + position);
            }

        });
        User.update({waitlist_position: -1}, {
            where: {
                last_seen: {lte: moment.utc().subtract(15, 'minutes').toDate()},
                last_active: {lte: moment.utc().subtract(15, 'minutes').toDate()}
            }
        });

    }

    function updateDbUser(user) {

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
            last_seen: new Date()
        };
        User.findOrCreate({where: {id: user.id}, defaults: userData}).spread(function (dbUser) {

            // Reset the user's AFK timer if they've been gone for long enough (so we don't reset on disconnects)
            if (secondsSince(dbUser.last_seen) >= 900) {
                userData.last_active = new Date();
                userData.waitlist_position = bot.getWaitListPosition(user.id)
            }
            dbUser.updateAttributes(userData);
        });

        //convertAPIUserID(user, function () {});

    }

    function convertAPIUserID(user, callback) {
        //db.get('SELECT userid FROM USERS WHERE username = ?', [user.username], function (error, row) {
        //    if (row != null && row.userid.length > 10) {
        //        logger.warning('Converting userid for ' + user.username + ': ' + row.userid + ' => ' + user.id);
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

    function reconnect() {
        bot.connect(config.roomName);
    }

    function monitorDJList() {

        if (config.prohibitMehInLine) {
            mehWaitList = bot.getWaitList();
            mehWaitList.forEach(function (dj) {
                if (dj.vote === -1) {
                    logger.warning('[REMOVE] Removed ' + dj.username + ' from wait list for mehing');
                    var position = bot.getWaitListPosition(dj.id);
                    bot.moderateRemoveDJ(dj.id);
                    bot.sendChat('@' + dj.username + ', voting MEH/Chato/:thumbsdown: while in line is prohibited. Check .rules.');
                    var userData = {
                        type: 'remove',
                        details: 'Removed from position ' + position + ' for mehing',
                        user_id: dj.id,
                        mod_user_id: bot.getUser().id
                    };
                    Karma.create(userData);
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
            mentionResponse(data);
        }
        else if (data.message.indexOf('.') === 0) {
            // @TODO - Build the list of possible commands on init() instead of querying every time
            chatResponse(data);
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
        // @FIXME - don't use the room. construct.
        //request('http://developer.echonest.com/api/v4/song/search?api_key=' + config.apiKeys.echoNest + '&format=json&results=1&combined=' + S(valueToCorrect).escapeHTML().stripPunctuation().s, function (error, response, body) {
        //    logger.info('echonest body', body);
        //    if (error) {
        //        bot.sendChat('An error occurred while connecting to EchoNest.');
        //        bot.error('EchoNest error', error);
        //    } else {
        //        response = JSON.parse(body).response;
        //
        //        room.media.suggested = {
        //            author: response.songs[0].artist_name,
        //            title: response.songs[0].title
        //        };
        //
        //        // log
        //        logger.info('[EchoNest] Original: "' + media.author + '" - "' + media.title + '". Suggestion: "' + room.media.suggested.author + '" - "' + room.media.suggested.title);
        //
        //        if (media.author != room.media.suggested.author || media.title != room.media.suggested.title) {
        //            bot.sendChat('Hey, the metadata for this song looks wrong! Suggested Artist: "' + room.media.suggested.author + '". Title: "' + room.media.suggested.title + '". Type ".fixsong yes" to use the suggested tags.');
        //        }
        //    }
        //});
    }

    function mentionResponse(data) {
        EventResponse.find({
            where: Sequelize.and({event_type: 'mention', is_active: true}),
            order: 'RAND()'
        })
            .on('success', function (row) {
                if (row === null) {
                    return;
                }
                else {
                    bot.sendChat(row.response.replace('{sender}', data.from.username));
                }

            });
    }

    function chatResponse(data) {
        EventResponse.find({
            where: Sequelize.and({event_type: 'chat', trigger: data.message.substring(1), is_active: true}),
            order: 'RAND()'
        })
            .on('success', function (row) {
                if (row === null) {
                    return;
                }
                else {
                    bot.sendChat(row.response.replace('{sender}', data.from.username));
                }

            });
    }
}
