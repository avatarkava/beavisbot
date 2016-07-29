path = require('path');
var fs = require('fs');

var config = require(path.resolve(__dirname, 'config.json'));
var models = require(path.resolve(__dirname, 'models'));
var PlugAPI = require('plugapi');
var Youtube = require('youtube-api');

var bot = new PlugAPI({
    email: config.auth.username,
    password: config.auth.password
});
bot.multiLine = true;
bot.multiLineLimit = 5;

initializeModules(config.auth, bot);

var roomHasActiveMods = false;
var mentions = {
    lastRunAll: 0,
    lastRunUsers: []
};
var skipTimer;
var botUser = {};

bot.connect(config.roomName); // The part after https://plug.dj

if (config.apiKeys.youtube !== undefined) {
    console.log('[YOUTUBE]', 'Authenticating with youtube...');
    Youtube.authenticate({
        type: "oauth",
        refresh_token: config.apiKeys.youtube.refresh_token,
        client_id: config.apiKeys.youtube.client_id,
        client_secret: config.apiKeys.youtube.client_secret,
        redirect_url: config.apiKeys.youtube.redirect_url,
    });
    console.log('[YOUTUBE]', 'Authenticated!')
}

bot.on('advance', function (data) {

    if (config.verboseLogging) {
        console.log('[EVENT] advance', JSON.stringify(data, null, 2));
    } else {
        console.log('[EVENT] advance');
    }

    // Write previous play data to DB
    if (data.lastPlay !== undefined && data.lastPlay !== null && data.lastPlay.media !== undefined && data.lastPlay.media !== null) {
        models.Song.find({
            where: {
                site: config.site,
                host: data.lastPlay.media.format,
                host_id: data.lastPlay.media.cid,
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
                    }).catch(function (err) {
                        console.log('[ERROR]', err);
                    });
                });

                if (data.lastPlay.score.grabs > 0) {
                    transferCustomPoints(null, data.lastPlay.dj, data.lastPlay.score.grabs);
                }
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
    var nextTimerDelay = (data.media.duration + 10) * 1000;
    if (config.queue.skipStuckSongs) {
        skipTimer = setTimeout(function () {
            if (bot.getMedia() && bot.getMedia().id == data.media.id) {
                console.log('[SKIP]', 'Skipping ' + data.media.name + ' because it appears to be stuck...');
                bot.sendChat('Skipping ' + data.media.name + ' because it appears to be stuck...');
                bot.moderateForceSkip();
            }
        }, (nextTimerDelay));
    }

    // Write current song data to DB
    var songData = {
        site: config.site,
        site_id: data.media.id.toString(),
        author: data.media.author,
        title: data.media.title,
        name: data.media.name,
        //description: data.media.description,
        host: data.media.format,
        host_id: data.media.cid,
        duration: data.media.duration,
        image: data.media.image
    };
    models.Song.findOrCreate({
        where: {site: config.site, host: data.media.format, host_id: data.media.cid},
        defaults: songData
    }).spread(function (song) {
            if (data.media.format == 1) {
                song.permalink = 'https://youtu.be/' + data.media.cid;
                song.updateAttributes(songData);
                writeRoomState(song.permalink);

                if (config.apiKeys.youtube !== undefined) {
                    Youtube.videos.list({
                        "part": "id,status",
                        "id": data.media.cid,
                    }, function (err, api_data) {
                        if (api_data) {
                            var needsSkip = false;
                            if (config.verboseLogging) {
                                console.log(api_data);
                            }
                            if (api_data.items.length === 0) {
                                /* The video is not available. */
                                needsSkip = true;
                            } else {
                                var item = _.first(api_data.items);
                                if (item.status) {
                                    if (item.status.embeddable === false) {
                                        needsSkip = true;
                                    }
                                }
                            }

                            if (needsSkip) {
                                console.log('[SKIP] Song was skipped because it is not available or embeddable');
                                bot.sendChat('/me Skipping this video because it is not available or embeddable.');
                                bot.moderateForceSkip();
                            }
                        }
                    });
                }
            } else if (data.media.format == 2) {
                soundcloud_get_track(data.media.cid, function (json_data) {
                    song.permalink = json_data.permalink_url;
                    song.updateAttributes(songData);
                    writeRoomState(song.permalink);

                    if (!json_data.streamable) {
                        console.log('[SKIP] Song was skipped because it is not available or embeddable');
                        bot.sendChat('/me Skipping this video because it is not available or embeddable.');
                        bot.moderateForceSkip();
                    }
                });
            }
        }
    ).catch(function (err) {
        console.log('[ERROR]', err);
    });

    if (config.queue.upvoteSongs == 'ALL') {
        bot.woot();
    }


    models.SongResponse.find({
        where: {
            $or: [{
                $and: [{media_type: 'author'}, {pattern: {$like: '%' + data.media.author + '%'}}],
                $and: [{media_type: 'title'}, {pattern: {$like: '%' + data.media.title + '%'}}],
                $and: [{media_type: 'id'}, {pattern: data.media.cid}]
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


    var maxIdleTime = config.queue.djIdleAfterMins * 60;
    var idleDJs = [];
    roomHasActiveMods = false;

    // @FIXME - This should probably be recoded using Promise.all so it's in order
    Promise.map(bot.getWaitList(), function (dj) {
        if (dj.id) {
            return models.User.find({
                where: {site_id: dj.id, site: config.site},
                include: {
                    model: models.Karma,
                    required: false,
                    where: {
                        type: 'warn',
                        created_at: {gte: moment.utc().subtract(config.queue.djIdleAfterMins, 'minutes').toDate()}
                    },
                    limit: 1,
                    order: [['created_at', 'DESC']]
                }
            }).then(function (dbUser) {
                if (dbUser) {
                    var position = bot.getWaitListPosition(dj.id);
                    if (bot.getWaitList().length >= config.queue.djIdleMinQueueLengthToEnforce && secondsSince(dbUser.last_active) >= maxIdleTime && moment.utc().isAfter(moment.utc(startupTimestamp).add(config.queue.djIdleAfterMins, 'minutes'))) {
                        console.log('[WL-IDLE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                        if (dbUser.Karmas.length > 0) {
                            console.log('[WL-IDLE]', dbUser.username + ' was last warned ' + timeSince(dbUser.Karmas[0].created_at));
                            bot.moderateRemoveDJ(dj.id);
                            bot.sendChat('@' + dbUser.username + ' ' + config.responses.activeDJRemoveMessage);
                            var userData = {
                                type: 'remove',
                                details: 'Removed from position ' + position + ': AFK for ' + timeSince(dbUser.last_active, true),
                                user_id: dbUser.id,
                                mod_user_id: botUser.db.id
                            };
                            models.Karma.create(userData);
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
                        if (dbUser.role > 1) {
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
        if (config.queue.maxSongLengthSecs > 0 && data.media.duration > config.queue.maxSongLengthSecs) {
            console.log('[SKIP] Skipped ' + data.currentDJ.username + ' spinning a song of ' + data.media.duration + ' seconds');
            var maxLengthMins = Math.floor(config.queue.maxSongLengthSecs / 60);
            var maxLengthSecs = config.queue.maxSongLengthSecs % 60;
            if (maxLengthSecs < 10) {
                maxLengthSecs = "0" + maxLengthSecs;
            }
            bot.sendChat('Sorry @' + data.currentDJ.username + ', this song is over our maximum room length of ' + maxLengthMins + ':' + maxLengthSecs + '.');
            bot.moderateForceSkip();
            getDbUserFromSiteUser(data.currentDJ, function (dbuser) {
                var userData = {
                    type: 'skip',
                    details: 'Skipped for playing a song of ' + data.media.duration + ' (room configured for max of ' + config.queue.maxSongLengthSecs + 's)',
                    user_id: dbuser.id,
                    mod_user_id: botUser.id
                };
                models.Karma.create(userData);
            });
        }
        else {
            models.Song.find({
                where: {
                    site: config.site,
                    host: data.media.format,
                    host_id: data.media.cid,
                    is_banned: true
                }
            }).then(function (row) {
                if (row !== null) {
                    console.log('[SKIP] Skipped ' + data.currentDJ.username + ' spinning a blacklisted song: ' + data.media.name + ' (id: ' + data.media.id + ')');
                    var message = 'Sorry @' + data.currentDJ.username + ', this video has been blacklisted in our song database.';
                    if (row.message) {
                        message += ' (' + row.message + ')';
                    }
                    bot.sendChat(message);
                    bot.moderateForceSkip();
                    getDbUserFromSiteUser(data.currentDJ, function (dbuser) {
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
    saveWaitList(true);
});
bot.on('chat', function (data) {

    if (config.verboseLogging) {
        console.log('[CHAT]', JSON.stringify(data, null, 2));
    }
    else if (data.from !== null && data.from.username !== undefined && data.from.username !== null) {
        console.log('[CHAT]', data.from.username + ': ' + data.message);
    }

    if (data.from.username !== undefined && data.from.username !== null) {
        data.message = data.message.trim();
        handleCommand(data);
        models.User.update({
            last_active: new Date(),
            last_seen: new Date(),
            locale: data.from.language
        }, {where: {site_id: data.from.id.toString(), site: config.site}});
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

    if (config.verboseLogging) {
        console.log('[INIT] Data loaded for ' + botUser.username + '\n ' + JSON.stringify(botUser, null, 2));
    }

    if (config.responses.botConnect !== "") {
        bot.sendChat(config.responses.botConnect);
    }

    bot.getUsers().forEach(function (user) {
        updateDbUser(user);
    });

    if (config.queue.upvoteSongs == 'ALL') {
        bot.woot();
    }

});
bot.on('userJoin', function (data) {

    if (config.verboseLogging) {
        console.log('[JOIN]', JSON.stringify(data, null, 2));
    } else if (data.username === undefined) {
        console.log('[JOIN] Guest joined');
    } else {
        console.log('[JOIN] ' + data.username + ' joined');
    }

    var newUser = false;
    var message = "";

    if (data.username !== undefined && data.username !== botUser.username) {
        getDbUserFromSiteUser(data, function (dbUser) {
            if (dbUser == null) {
                newUser = true;
                message = config.responses.welcome.newUser.replace('{username}', data.username);
                if (!roomHasActiveMods) {
                    message += ' Type .help if you need it!';
                }
                models.RoomEvent.find({
                    where: {
                        starts_at: {lte: new Date()},
                        ends_at: {gte: new Date()}
                    }
                }).then(function (event) {
                    if (event !== null) {
                        if (event.type == 'event') {
                            message += ' :star: SPECIAL EVENT :star: ' + event.title + ' (.event for details)';
                        }
                        else if (event.type == 'theme') {
                            message += ' Theme: ' + event.title + ' (.theme for details)';
                        }
                    }

                    console.log('[JOIN]', data.username + ' is a first-time visitor to the room!');
                    if ((config.welcomeUsers == "NEW" || config.welcomeUsers == "ALL")) {
                        setTimeout(function () {
                            bot.sendChat(message)
                        }, 5000);
                    }
                });


            }
            else {
                models.EventResponse.find({
                    where: {event_type: 'userJoin', pattern: data.username, is_active: true},
                    order: 'RAND()'
                }).then(function (eventResponse) {
                    if (eventResponse == null) {
                        message = config.responses.welcome.oldUser.replace('{username}', data.username);
                    }
                    else {
                        message = eventResponse.response.replace('{username}', data.username);
                    }
                }).then(function () {
                    models.RoomEvent.find({
                        where: {
                            starts_at: {lte: new Date()},
                            ends_at: {gte: new Date()}
                        }
                    }).then(function (event) {
                        if (event !== null) {
                            if (event.type == 'event') {
                                message += ' :star: SPECIAL EVENT :star: ' + event.title + ' (.event for details)';
                            }
                            else if (event.type == 'theme') {
                                message += ' Theme: ' + event.title + ' (.theme for details)';
                            }
                        }

                        if (message && config.welcomeUsers == "ALL" && secondsSince(dbUser.last_active) >= 900 && secondsSince(dbUser.last_seen) >= 900) {
                            setTimeout(function () {
                                bot.sendChat(message)
                            }, 5000);
                        }

                        console.log('[JOIN]', data.username + ' last seen ' + timeSince(dbUser.last_seen));
                    });
                });
            }

            // Restore spot in line if user has been gone < 15 mins
            var position = bot.getWaitListPosition(data.id);
            if (!newUser && dbUser.queue_position > -1 && secondsSince(dbUser.last_seen) <= 900 && (position === -1 || (position > -1 && position > dbUser.queue_position))) {
                bot.moderateAddDJ(data.id, function () {
                    if (dbUser.queue_position < bot.getWaitList().length && position !== dbUser.queue_position) {
                        bot.moderateMoveDJ(data.id, dbUser.queue_position);
                    }

                    var userData = {
                        type: 'restored',
                        details: 'Restored to position ' + dbUser.queue_position + ' (disconnected for ' + timeSince(dbUser.last_seen, true) + ')',
                        user_id: dbUser.id,
                        mod_user_id: botUser.db.id
                    };
                    models.Karma.create(userData);

                    setTimeout(function () {
                        bot.sendChat('/me put @' + data.username + ' back in line (reconnected) :thumbsup:')
                    }, 5000);

                });
            }
        });
        updateDbUser(data);
    }
});

bot.on('userLeave', function (data) {
    console.log('[LEAVE]', 'User left: ' + data.username);
    models.User.update({last_leave: new Date()}, {where: {site: config.site, site_id: data.id.toString()}});
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
    } else if (user && data.v == -1) {
        console.log('[VOTE] ' + user.username + ' voted ' + data.v);
    }

    if (config.queue.prohibitDownvoteInQueue && data.v == -1 && bot.getWaitListPosition(data.i) > 0) {
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

/**
 * @TODO - No current handling
 */
bot.on('boothLocked', function (data) {
    console.log('[EVENT] boothLocked ', JSON.stringify(data, null, 2));
})
;
bot.on('chatDelete', function (data) {
    console.log('[EVENT] chatDelete ', JSON.stringify(data, null, 2));
});
bot.on('djListUpdate', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] djListUpdate ', JSON.stringify(data, null, 2));
    }
    saveWaitList(false);
});
bot.on('djUpdate', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] djUpdate ', JSON.stringify(data, null, 2));
    }
});
bot.on('emote', function (data) {
    if (config.verboseLogging) {
        console.log('[EVENT] emote ', JSON.stringify(data, null, 2));
    }
});
bot.on('followJoin', function (data) {
    console.log('[EVENT] followJoin ', JSON.stringify(data, null, 2));
});

bot.on('modAddDj', function (data) {
    console.log('[EVENT] modAddDj ', JSON.stringify(data, null, 2));
});
bot.on('modBan', function (data) {
    console.log('[EVENT] modBan ', JSON.stringify(data, null, 2));
});
bot.on('modMoveDJ', function (data) {
    console.log('[EVENT] modMoveDJ ', JSON.stringify(data, null, 2));
});
bot.on('modRemoveDJ', function (data) {
    console.log('[EVENT] modRemoveDJ ', JSON.stringify(data, null, 2));
    saveWaitList(true);
});
bot.on('modSkip', function (data) {
    console.log('[EVENT] modSkip ', JSON.stringify(data, null, 2));
});
bot.on('roomMinChatLevelUpdate', function (data) {
    console.log('[EVENT] roomMinChatLevelUpdate ', JSON.stringify(data, null, 2));
});
bot.on('tcpConnect', function (socket) {
    console.log('[TCP] Connected!');
});
bot.on('tcpMessage', function (socket, msg) {
    if (typeof msg !== "undefined" && msg.length > 2) {
        console.log('[TCP] ' + msg);
        // Convert into same format as incoming chat messages through the UI
        var data = {
            message: msg,
            from: bot.getUser()
        };

        if (data.message.indexOf('.') === 0) {
            handleCommand(data);
        }
        else {
            bot.sendChat(msg);
        }
    }
});

if (config.queue.djIdleAfterMins > 0) {
    setInterval(monitorDJList, 5000);
}

function saveWaitList(wholeRoom) {

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
            }, {where: {site: config.site, site_id: user.id.toString()}});
        }
        else {
            models.User.update({queue_position: -1}, {where: {site: config.site, site_id: user.id.toString()}});
        }

        if (config.verboseLogging) {
            console.log('[WL-UPDATE]', user.username + ' => ' + position);
        }

    });
    models.User.update({queue_position: -1}, {
        where: {
            last_seen: {lte: moment.utc().subtract(15, 'minutes').toDate()},
            last_active: {lte: moment.utc().subtract(15, 'minutes').toDate()},
            queue_position: {ne: -1}
        }
    });

}

function updateDbUser(user) {

    var userData = {
        site: config.site,
        site_id: user.id,
        username: user.username,
        slug: user.slug,
        language: user.language,
        avatar: user.avatarID,
        badge: user.badge,
        bio: user.blurb,
        role: user.role,
        site_points: user.level,
        last_seen: new Date(),
    };

    models.User.findOrCreate({
        where: {site_id: user.id, site: config.site},
        defaults: userData
    }).spread(function (dbUser) {

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
        console.log('[ERROR]', err);
    });

}

function monitorDJList() {

}
function removeIfDownvoting(mehUsername) {

    var mehWaitList = bot.getWaitList();
    var mehUser = findUserInList(mehWaitList, mehUsername);

    if (config.verboseLogging) {
        console.log('[WAITLIST]' + JSON.stringify(mehWaitList, null, 2));
    }

    if (mehUser !== undefined && mehUser.vote == -1) {
        console.log('[REMOVE] Removed ' + mehUser.username + ' from wait list for mehing');
        var position = bot.getWaitListPosition(mehUser.id);
        bot.moderateRemoveDJ(mehUser.id);
        bot.sendChat('@' + mehUser.username + ', voting MEH/Chato/:thumbsdown: while in line is prohibited. Check .rules.');
        getDbUserFromSiteUser(mehUser.id, function (row) {
            var userData = {
                type: 'remove',
                details: 'Removed from position ' + position + ' for mehing',
                user_id: row.id,
                mod_user_id: botUser.db.id
            };
            models.Karma.create(userData);
        });
    }
}

function initializeModules(auth, bot) {
    // load context
    require(path.resolve(__dirname, 'context.js'))({auth: auth, config: config, bot: bot});
    loadCommands();
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

        // Don't allow @mention to the bot - prevent loopback
        data.message = data.message.replace('@' + botUser.username, '');

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

            var can_run_command = true;
            var cur_time = Date.now() / 1000;
            var time_diff = cur_time - command.lastRun;
            var time_diff_user = cur_time;
            if (data.from.id in command.lastRunUsers) {
                time_diff_user -= command.lastRunUsers[data.from.id];
            }

            if (data.from.role >= PlugAPI.ROOM_ROLE.BOUNCER) {
                if (command.cdStaff >= time_diff) {
                    console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdStaff) ' + time_diff);
                    can_run_command = false;
                }
            } else {
                if (command.cdAll >= time_diff) {
                    console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdAll) ' + time_diff);
                    can_run_command = false;
                } else if (command.cdUser >= time_diff_user) {
                    console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdUser) ' + time_diff_user);
                    can_run_command = false;
                }
            }

            if (config.verboseLogging) {
                console.log('[COMMAND]', JSON.stringify(data, null, 2));
            }

            if (config.removeCommands && command.removeCommand !== false) {
                bot.moderateDeleteChat(data.id);
            }

            if (can_run_command && hasPermission(data.from, command.minRole)) {

                // Grab db data for the user that sent this message
                getDbUserFromSiteUser(data.from, function (row) {
                    data.from.db = row;
                    var r = command.handler(data);
                    if (typeof r === 'object' && 'cdAll' in r && 'cdUser' in r) {
                        command.lastRun = cur_time - command.cdAll + r.cdAll;
                        command.lastRunUsers[data.from.id] = cur_time - command.cdUser + r.cdUser;
                    } else if (r !== false) {
                        command.lastRun = cur_time;
                        command.lastRunUsers[data.from.id] = cur_time;
                    }
                });
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

    // Antispam
    var cooldown_all = 10;
    var cooldown_user = 30;
    var cur_time = Date.now() / 1000;
    var time_diff = cur_time - mentions.lastRunAll;
    var time_diff_user = cur_time;

    if (data.from.id in mentions.lastRunUsers) {
        time_diff_user -= mentions.lastRunUsers[data.from.id];
    }

    if (cooldown_all >= time_diff) {
        console.log('[ANTISPAM]', data.from.username + ' cannot chat with the bot - antispam (all) ' + time_diff);
    } else if (cooldown_user >= time_diff_user) {
        console.log('[ANTISPAM]', data.from.username + ' cannot chat with the bot - antispam (user) ' + time_diff_user);
    } else {

        if (config.verboseLogging) {
            console.log('[ANTISPAM]', data.from.username + ' passed antispam (user) ' + time_diff_user + ':' + time_diff);
        }
        mentions.lastRunAll = cur_time;
        mentions.lastRunUsers[data.from.id] = cur_time;

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
}

function chatResponse(data) {
    models.EventResponse.find({
            where: {event_type: 'chat', pattern: data.message, is_active: true},
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
function writeRoomState(permalink) {
    // Writes current room state to outfile so it can be used for the web
    if (config.roomStateFile) {

        var JSONstats = {}

        JSONstats.media = bot.getMedia();
        JSONstats.permalink = permalink;
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
}