path = require('path');
var fs = require('fs');

var config = require(path.resolve(__dirname, 'config.json'));
var models = require(path.resolve(__dirname, 'models'));
var PlugAPI = require('plugapi');

var bot = new PlugAPI({
    email: config.auth.username,
    password: config.auth.password
});
bot.multiLine = true;
bot.multiLineLimit = 5;

initializeModules(config.auth, bot);

var roomHasActiveMods = false;
var skipTimer;
var botUser = {};

bot.connect(config.roomName); // The part after https://plug.dj

bot.on('advance', function (data) {

    if (config.verboseLogging) {
        console.log('[EVENT] advance', JSON.stringify(data, null, 2));
    } else {
        console.log('[EVENT] advance');
    }

    //saveWaitList(true);

    // Writes current room state to outfile so it can be used for the web
    if (config.roomStateFile) {

        var JSONstats = {}

        JSONstats.media = bot.getMedia();
        JSONstats.dj = bot.getDJ();
        JSONstats.roomQueue = bot.getWaitList();
        JSONstats.users = bot.getUsers();
        JSONstats.staff = bot.getStaff();

        fs.writeFile(
            config.roomStateFile,
            CircularJSON.stringify(JSONstats, function (key, value) {
                if (key == 'parent') {
                    return value.id;
                }
                else {
                    return value;
                }
            }, 2),

            function (err) {
                if (err) {
                    console.log(err);
                    return console.log(err);
                }
            }
        );

    }

    // Write previous play data to DB
    if (data.lastPlay !== undefined && data.lastPlay !== null && data.lastPlay.media !== undefined && data.lastPlay.media !== null) {
        models.Song.find({
            where: {
                site_id: data.lastPlay.media.id.toString()
            }
        }).then(function (song) {
            if (song !== null) {
                getDbUserFromSiteUser(data.lastPlay.dj, function (lastDJ) {
                    models.Play.create({
                        site_id: data.lastPlay.media.id.toString(),
                        user_id: lastDJ.id,
                        song_id: song.id,
                        positive: data.lastPlay.score.positive,
                        negative: data.lastPlay.score.negative,
                        grabs: data.lastPlay.score.grabs,
                        listeners: bot.getUsers().length,
                        skipped: data.lastPlay.score.skipped
                    });
                });
            }
        });
    }

    if (data.media == undefined) {
        return;
    }

    data.media.name = data.media.author + ' - ' + data.media.title;

    console.log('********************************************************************');
    console.log('[UPTIME]', 'Bot online ' + timeSince(startupTimestamp, true));
    console.log('[SONG]', data.currentDJ.username + ' played: ' + data.media.name + ' (' + data.media.id + ')');

    // Perform automatic song metadata correction
    if (config.autoSuggestCorrections) {
        correctMetadata();
    }

    // Auto skip for "stuck" songs
    clearTimeout(skipTimer);
    if (config.skipStuckSongs) {
        skipTimer = setTimeout(function () {
            if (bot.getMedia() && bot.getMedia().id == data.media.id) {
                console.log('[SKIP]', 'Skipping ' + data.media.name + ' because it appears to be stuck...');
                //bot.sendChat('Skipping ' + data.media.name + ' because it appears to be stuck...');
                // @TODO fix crazy skip
                // bot.moderateForceSkip();
            }
        }, (data.media.duration + 10));
    }

    // Write current song data to DB
    var songData = {
        site_id: data.media.id.toString(),
        author: data.media.author,
        title: data.media.title,
        name: data.media.name,
        //description: data.media.description,
        //host: data.media.type,
        host_id: data.media.cid,
        duration: data.media.duration,
        image: data.media.image
    };
    models.Song.findOrCreate({
        where: {site_id: data.media.id.toString()},
        defaults: songData
    }).spread(function (song) {
        song.updateAttributes(songData);
    });

    if (config.upvoteSongs == 'ALL') {
        bot.woot();
    }


    models.SongResponse.find({
        where: {
            $or: [{
                $and: [{media_type: 'author'}, {trigger: {$like: '%' + data.media.author + '%'}}],
                $and: [{media_type: 'title'}, {trigger: {$like: '%' + data.media.title + '%'}}],
            }],
            is_active: true
        }
    }).then(function (songresponse) {
        if (songresponse !== null) {
            if (songresponse.response != '') {
                bot.sendChat(songresponse.response);
            }
            if (songresponse.rate === 1) {
                bot.woot();
            }
            else if (songresponse.rate === -1) {
                bot.meh();
            }
        }
    });


    var maxIdleTime = config.activeDJTimeoutMins * 60;
    var idleDJs = [];
    roomHasActiveMods = false;

    // @FIXME - This should probably be recoded using Promise.all so it's in order
    Promise.map(bot.getWaitList(), function (queueItem) {
        if (queueItem.user) {
            return models.User.find({
                where: {site_id: queueItem.user.id},
                include: {
                    model: models.Karma,
                    required: false,
                    where: {
                        type: 'warn',
                        created_at: {gte: moment.utc().subtract(config.activeDJTimeoutMins, 'minutes').toDate()}
                    },
                    limit: 1,
                    order: [['created_at', 'DESC']]
                }
            }).then(function (dbUser) {
                var position = bot.getWaitListPosition(dbUser.site_id);
                if (dbUser) {
                    if (bot.getWaitList().length >= config.minActiveDJQueueLength && secondsSince(dbUser.last_active) >= maxIdleTime && moment.utc().isAfter(moment.utc(startupTimestamp).add(config.activeDJTimeoutMins, 'minutes'))) {
                        console.log('[WL-IDLE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                        if (dbUser.Karmas.length > 0) {
                            console.log('[WL-IDLE]', dbUser.username + ' was last warned ' + timeSince(dbUser.Karmas[0].created_at));
                            bot.moderateRemoveDJ(dbUser.site_id);
                            bot.sendChat('@' + dbUser.username + ' ' + config.responses.activeDJRemoveMessage);
                            var userData = {
                                type: 'remove',
                                details: 'Removed from position ' + position + ': AFK for ' + timeSince(dbUser.last_active, true),
                                user_id: dbUser.id,
                                mod_user_id: botUser.db.id
                            };
                            models.Karma.create(userData);
                            models.User.update({queue_position: -1}, {where: {id: dbUser.id}});
                        }
                        else if (position > 1) {
                            var userData = {
                                type: 'warn',
                                details: 'Warned in position ' + position + ': AFK for ' + timeSince(dbUser.last_active, true),
                                user_id: dbUser.id,
                                mod_user_id: botUser.db.id
                            };
                            models.Karma.create(userData);
                            idleDJs.push(dbUser.username);
                        }
                    }
                    else {
                        if (bot.hasPermission(bot.getUser(dbUser.site_id), 'queue-order')) {
                            roomHasActiveMods = true;
                        }
                        console.log('[WL-ACTIVE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                    }
                }

            });
        }
    }).then(function () {
        if (idleDJs.length > 0) {
            var idleDJsList = idleDJs.join(' @');
            bot.sendChat('@' + idleDJsList + ' ' + config.responses.activeDJReminder);
        }

        // Check if the song is too long for room settings.  Then check to see if it's blacklisted
        if (config.maxSongLengthSecs > 0 && data.media.duration > config.maxSongLengthSecs) {
            console.log('[SKIP] Skipped ' + data.username + ' spinning a song of ' + data.media.duration + ' seconds');
            var maxLengthMins = Math.floor(config.maxSongLengthSecs / 60);
            var maxLengthSecs = config.maxSongLengthSecs % 60;
            if (maxLengthSecs < 10) {
                maxLengthSecs = "0" + maxLengthSecs;
            }
            bot.sendChat('Sorry @' + data.username + ', this song is over our maximum room length of ' + maxLengthMins + ':' + maxLengthSecs + '.');
            bot.moderateForceSkip();
            getDbUserFromSiteUser(data.user, function (dbuser) {
                var userData = {
                    type: 'skip',
                    details: 'Skipped for playing a song of ' + data.media.duration + ' (room configured for max of ' + config.maxSongLengthSecs + 's)',
                    user_id: dbuser.id,
                    mod_user_id: botUser.id
                };
                models.Karma.create(userData);
            });
        }
        else {
            models.Song.find({
                where: {
                    site_id: data.media.id,
                    is_banned: true
                }
            }).then(function (row) {
                if (row !== null) {
                    console.log('[SKIP] Skipped ' + data.username + ' spinning a blacklisted song: ' + data.media.name + ' (id: ' + data.media.id + ')');
                    var message = 'Sorry @' + data.username + ', this video has been blacklisted in our song database.';
                    if (row.message) {
                        message += ' (' + row.message + ')';
                    }
                    bot.sendChat(message);
                    bot.moderateForceSkip();
                    getDbUserFromSiteUser(data.user, function (dbuser) {
                        var userData = {
                            type: 'skip',
                            details: 'Skipped for playing a blacklisted song: ' + data.media.name + ' (id: ' + data.media.id + ')',
                            user_id: dbuser.id,
                            mod_user_id: botUser.id
                        };
                        models.Karma.create(userData);
                    });

                }
            });
        }

    });
});
bot.on('chat', function (data) {

    if (config.verboseLogging) {
        console.log('[CHAT]', JSON.stringify(data, null, 2));
    }
    else if (data.from.username !== undefined && data.from.username !== null) {
        console.log('[CHAT]', data.from.username + ': ' + data.message);
    }

    if (data.from.username !== undefined && data.from.username !== null) {
        data.message = data.message.trim();
        handleCommand(data);
        models.User.update({
            last_active: new Date(),
            last_seen: new Date(),
            locale: data.from.language
        }, {where: {site_id: data.from.id.toString()}});
    }
});
bot.on('connected', function () {
    console.log('Connected!');
});
bot.on('grab', function (data) {

    user = bot.getUser(data);

    if (config.verboseLogging) {
        console.log('[VOTE] ' + JSON.stringify(data, null, 2));
    } else if (user) {
        console.log('[GRAB]', user.username + ' grabbed this song');
    }
});
bot.on('roomJoin', function (data) {
    console.log('[EVENT] Ready - joined room: ' + config.roomName);
    if (config.verboseLogging) {
        console.log('[INIT] Room data: ' + JSON.stringify(data, null, 2));
    }

    botUser = bot.getSelf();

    getDbUserFromSiteUser(botUser, function (row) {
        botUser.db = row;
    });

    console.log('[INIT] Data loaded for ' + botUser.username + '\n ' + JSON.stringify(botUser, null, 2));

    if (config.responses.botConnect !== "") {
        bot.sendChat(config.responses.botConnect);
    }

    bot.getUsers().forEach(function (user) {
        updateDbUser(user);
    });

    if (config.upvoteSongs == 'ALL') {
        bot.woot();
    }

});
bot.on('userJoin', function (data) {

    if (config.verboseLogging) {
        console.log('[JOIN]', JSON.stringify(data, null, 2));
    }
    else {
        console.log('[JOIN] ' + data.username + ' joined');
    }

    var newUser = false;
    var message = "";

    if (data.username !== botUser.username) {
        getDbUserFromSiteUser(data.id, function (dbUser) {
            if (dbUser == null) {
                message = config.responses.welcome.newUser.replace('{username}', data.username);
                if (!roomHasActiveMods) {
                    message += ' Type .help if you need it!';
                }
                newUser = true;
                console.log('[JOIN]', data.username + ' is a first-time visitor to the room!');
            }
            else {
                models.EventResponse.find({
                        where: {event_type: 'userJoin', trigger: data.username, is_active: true},
                        order: 'RAND()'
                    })
                    .then(function (row) {
                        if (row === null) {
                            message = config.responses.welcome.oldUser.replace('{username}', data.username);
                        }
                        else {
                            message = row.response.replace('{username}', data.username);
                        }
                        console.log('[JOIN]', message);
                    });
                console.log('[JOIN]', data.username + ' last seen ' + timeSince(dbUser.last_seen));
            }

            // Greet with the theme if it's not the default
            models.RoomEvent.find({
                where: {
                    starts_at: {lte: new Date()},
                    ends_at: {gte: new Date()}
                }
            }).then(function (row) {
                if (row !== null) {
                    if (row.type == 'event') {
                        message += ' :star: SPECIAL EVENT :star: ' + row.title + ' (.event for details)';
                    }
                    else if (row.type == 'theme') {
                        message += ' Theme: ' + row.title + ' (.theme for details)';
                    }
                }
            });

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
                            details: 'Restored to position ' + dbUser.waitlist_position + ' (disconnected for ' + timeSince(dbUser.last_seen, true) + ')',
                            user_id: data.id,
                            mod_user_id: botUser.id
                        };
                        models.Karma.create(userData);

                        setTimeout(function () {
                            bot.sendChat('/me put @' + data.username + ' back in line :thumbsup:')
                        }, 5000);
                    }

                });
            }
            updateDbUser(data);
        });
    }
});
bot.on('userLeave', function (data) {
    console.log('[LEAVE]', 'User left: ' + data.username);
    // models.User.update({last_seen: new Date()}, {where: {id: data.id}});
});
bot.on('userUpdate', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] USER_UPDATE', data);
    }
});
bot.on('vote', function (data) {

    user = bot.getUser(data.i);

    if (config.verboseLogging) {
        data.user = user;
        console.log('[VOTE] ' + JSON.stringify(data, null, 2));
    } else if (user) {
        console.log('[VOTE] ' + user.username + ' voted ' + data.v);
    }

    if (config.prohibitDownvoteInQueue && data.v == -1 && bot.getWaitListPosition(data.i) > 0) {
        bot.sendChat('@' + user.username + ', voting down while in queue is prohibited. Please vote up or leave the queue.');
        setTimeout(function () {
            removeIfDownvoting(user.username);
        }, 10 * 1000);
    }
});


bot.on('error', function (msg, trace) {
    console.log("Got an error from the virtual browser: ", msg, trace);
});
bot.on('disconnected', function (data) {
    bot.reconnect();
});

bot.on('djListUpdate', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});

/**
 * @TODO - No current handling
 */
bot.on('boothLocked', function (data) {
});
bot.on('chatDelete', function (data) {
});
bot.on('djUpdate', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});
bot.on('emote', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});
bot.on('followJoin', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});

bot.on('modAddDj', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});
bot.on('modBan', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});
bot.on('modMoveDJ', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});
bot.on('modRemoveDJ', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});
bot.on('modSkip', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});

bot.on('roomMinChatLevelUpdate', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] DJ_LIST_UPDATE', JSON.stringify(data, null, 2));
    }
    //saveWaitList(false);
});

if (config.activeDJTimeoutMins > 0) {
    setInterval(monitorDJList, 5000);
}

function saveQueue(wholeRoom) {

    if (wholeRoom) {
        var userList = bot.getUsers();
    }
    else {
        var userList = bot.getWaitList();
    }
    userList.forEach(function (user) {
        var position = bot.getWaitListPosition(user.id);
        // user last seen in 900 seconds
        if (position > 0) {
            models.User.update({
                queue_position: position,
                last_seen: moment.utc().toDate()
            }, {where: {id: user.id}});
        }
        else {
            models.User.update({queue_position: -1}, {where: {id: user.id}});
        }
        if (config.verboseLogging) {
            console.log('Wait List Update', user.username + ' => ' + position);
        }

    });
    models.User.update({queue_position: -1}, {
        where: {
            last_seen: {lte: moment.utc().subtract(15, 'minutes').toDate()},
            last_active: {lte: moment.utc().subtract(15, 'minutes').toDate()}
        }
    });

}

function updateDbUser(user) {

    var userData = {
        site_id: user.id,
        username: user.username,
        language: user.language,
        slug: user.slug,
        role: user.role,
        last_seen: new Date(),
    };

    models.User.findOrCreate({where: {site_id: user.id}, defaults: userData}).spread(function (dbUser) {

        // Set join date to be the first time we see the user in our room
        if (dbUser.joined === undefined) {
            userData.joined = new Date();
        }

        // Reset the user's AFK timer if they've been gone for long enough (so we don't reset on disconnects)
        if (secondsSince(dbUser.last_seen) >= 900) {
            userData.last_active = new Date();
            userData.queue_position = bot.getWaitListPosition(user.id);
        }
        dbUser.updateAttributes(userData);
    }).catch(function (err) {
        console.log('Error occurred', err);
    });

}

function monitorDJList() {

}

function removeIfDownvoting(mehUsername) {

    var mehWaitList = bot.getWaitList();
    var mehUser = _.findWhere(mehWaitList, {username: mehUsername});

    if (config.verboseLogging) {
        console.log('[WAITLIST]' + JSON.stringify(mehWaitList, null, 2));
    }

    if (mehUser !== undefined && mehUser.vote == -1) {
        console.log('[REMOVE] Removed ' + mehUser.username + ' from wait list for mehing');
        var position = bot.getWaitListPosition(mehUser.id);
        bot.moderateRemoveDJ(mehUser.id);
        bot.sendChat('@' + mehUser.username + ', voting MEH/Chato/:thumbsdown: while in line is prohibited. Check .rules.');
        var userData = {
            type: 'remove',
            details: 'Removed from position ' + position + ' for mehing',
            user_id: mehUser.id,
            mod_user_id: botUser.id
        };
        models.Karma.create(userData);
        models.User.update({waitlist_position: -1}, {where: {id: mehUser.id}});
    }
}

function initializeModules(auth, bot) {
    // load context
    require(path.resolve(__dirname, 'context.js'))({auth: auth, config: config, bot: bot});

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

    // Only listen to the superAdmin when in development mode
    if (config.developmentMode && data.from.username !== config.superAdmin) {
        return;
    }

    // unescape message
    data.message = S(data.message).unescapeHTML().s;

    data.message = data.message.replace(/&#39;/g, '\'');
    data.message = data.message.replace(/&#34;/g, '\"');
    data.message = data.message.replace(/&amp;/g, '\&');
    data.message = data.message.replace(/&lt;/gi, '\<');
    data.message = data.message.replace(/&gt;/gi, '\>');

    if (data.message.charAt(0) === config.commandLiteral) {

        // Chop off the command literal
        data.message = data.message.substr(1);

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
                console.log('[COMMAND]', JSON.stringify(data, null, 2));
            }

            // Don't allow @mention to the bot - prevent loopback
            data.message = data.message.replace('@' + botUser.username, '');

            // Grab the db entries for the user that sent this message
            if (data.from.id !== null) {
                getDbUserFromSiteUser(data.from, function (row) {
                    data.from.db = row;
                    command.handler(data);
                });
            }
            else {
                command.handler(data);
            }
        }
        else if (!config.quietMode) {
            // @TODO - Build the list of possible commands on init() instead of querying every time
            chatResponse(data);
        }
    }
    else if (!config.quietMode && data.message.indexOf('@' + botUser.username) > -1) {
        mentionResponse(data);
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
    //    console.log('echonest body', body);
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
    //        console.log('[EchoNest] Original: "' + media.author + '" - "' + media.title + '". Suggestion: "' + room.media.suggested.author + '" - "' + room.media.suggested.title);
    //
    //        if (media.author != room.media.suggested.author || media.title != room.media.suggested.title) {
    //            bot.sendChat('Hey, the metadata for this song looks wrong! Suggested Artist: "' + room.media.suggested.author + '". Title: "' + room.media.suggested.title + '". Type ".fixsong yes" to use the suggested tags.');
    //        }
    //    }
    //});
}

function mentionResponse(data) {
    // How much ADHD does the bot have?
    chatRandomnessPercentage = 5;
    if (config.chatRandomnessPercentage) {
        chatRandomnessPercentage = config.chatRandomnessPercentage;
    }

    if (_.random(1, 100) > chatRandomnessPercentage) {
        cleverMessage = data.message.replace('@' + botUser.username, '').trim();
        Cleverbot.prepare(function () {
            cleverbot.write(cleverMessage, function (response) {
                if (config.verboseLogging) {
                    console.log('[CLEVERBOT]', JSON.stringify(response, null, 2));
                }
                bot.sendChat('@' + data.from.username + ', ' + response.message);
            });
        });
    }
    else {
        models.EventResponse.find({
                where: {event_type: 'mention', is_active: true},
                order: 'RAND()'
            })
            .then(function (row) {
                if (row === null) {
                    return;
                }
                else {
                    bot.sendChat(row.response.replace('{sender}', data.from.username));
                }

            });
    }
}

function chatResponse(data) {
    models.EventResponse.find({
            where: {event_type: 'chat', trigger: data.message, is_active: true},
            order: 'RAND()'
        })
        .then(function (row) {
            if (row === null) {
                return;
            }
            else {
                bot.sendChat(row.response.replace('{sender}', data.from.username));
            }

        });
}

function addCustomPoint(data) {

}
