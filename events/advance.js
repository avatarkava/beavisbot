module.exports = function (bot) {

    bot.on('advance', function (data) {

        if (config.verboseLogging) {
            console.log('[EVENT] advance', JSON.stringify(data, null, 2));
        } else {
            console.log('[EVENT] advance');
        }

        bot.getHistory(function (history) {
            bot.mediaHistory = history;
        });


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

        models.Play.findOne({
            include: [{
                model: models.Song,
                where: {$and: [{site: config.site}, {host: data.media.format}, {host_id: data.media.cid}]}
            }, models.User],
            order: [['created_at', 'DESC']]
        }).then(function (row) {
            if (!row) {
                bot.sendChat('/me This is the first time I have seen this video of "' + data.media.author + ' - ' + data.media.title + '"  played!');
            } else {
                message = row.Song.name + ' • last played ' + timeSince(row.created_at) + ' by ' + row.User.username
                    + ' • ' + row.listeners + ' :ear: • ' + row.positive + ' :+1: • ' + row.grabs + ' :star: • ' + row.negative + ' :-1:';
                bot.sendChat('/me ' + message);
            }
        });

        // Auto skip for "stuck" songs
        if (typeof skipTimer !== 'undefined') {
            clearTimeout(skipTimer);
        }
        var nextTimerDelay = (data.media.duration + 10) * 1000;
        if (config.queue.skipStuckSongs) {
            skipTimer = setTimeout(function () {
                if (bot.getMedia() && bot.getMedia().id == data.media.id) {
                    var message = '[SKIP] Skipping ' + data.media.name + ' because it appears to be stuck...';
                    console.log(message);
                    sendToSlack(message);
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
                if (data.media.duration == 0) {
                    console.log('[ZEROLENGTH] Song was advanced by the site because it reported a duration of 0');
                    bot.sendChat('/me @' + data.currentDJ.username + ', this song was reported as 0:00 long. Please check your playlist or try .zerolength for more info.');
                }
                else if (data.media.format == 1) {
                    song.permalink = 'https://youtu.be/' + data.media.cid;

                    if (config.apiKeys.youtube.client_id !== undefined) {
                        YouTube.videos.list({
                            "part": "id,snippet,status,statistics",
                            "id": data.media.cid,
                        }, function (err, api_data) {
                            if (api_data) {
                                if (config.verboseLogging) {
                                    console.log('[YOUTUBE] ' + JSON.stringify(api_data, null, 2));
                                }

                                var available = true;
                                var banned = false;
                                var lowViewCount = false;

                                if (api_data.items.length === 0) {
                                    available = false;
                                } else {
                                    var item = _.first(api_data.items);
                                    if (!item.status || item.status.embeddable === false) {
                                        available = false;
                                    }
                                    if (item.statistics && item.statistics.viewCount < 100) {
                                        lowViewCount = true;
                                    }

                                    //@FIXME - Move this to a databased instance
                                    if (_.contains(config.queue.bannedChannels.youtube, item.snippet.channelId)) {
                                        banned = true;
                                    }
                                }

                                if (banned) {
                                    bot.moderateBanUser(data.currentDJ.id, 0, PlugAPI.BAN.PERMA);
                                    bot.sendChat('NOOOOOOOOOPE. https://media.giphy.com/media/9wBub5vhSsTDi/giphy.gif');
                                    models.Song.update({is_banned: 1}, {where: {host_id: data.media.cid}});
                                    var message = '[SKIPBAN] Song ' + song.permalink + ' skipped and ' + data.currentDJ.username + '(ID: ' + data.currentDJ.id + ') banned because they used a song from a blacklisted channel.';
                                    console.log(message);
                                    sendToSlack(message);
                                } else if (!available) {
                                    var message = '[SKIP] Song was skipped because it is not available or embeddable';
                                    console.log(message);
                                    sendToSlack(message);
                                    bot.sendChat('/me @' + data.currentDJ.username + ', skipping this video because it is not available or embeddable. Please update your playlist!');
                                    bot.moderateForceSkip();
                                } else if (lowViewCount) {
                                    var message = '[YOUTUBE] The current video played has very few views. You may want to check it for :trollface:... ' + data.media.name + ' (' + song.permalink + ') played by ' + data.currentDJ.username + ' (ID: ' + data.currentDJ.id + ')';
                                    console.log(message);
                                    sendToSlack(message);

                                }
                            } else {
                                console.log(err);
                            }
                        });
                    }
                } else if (data.media.format == 2) {
                    soundcloud_get_track(data.media.cid, function (json_data) {
                        song.permalink = json_data.permalink_url;

                        if (!json_data.streamable) {
                            console.log('[SKIP] Song was skipped because it is not available or embeddable');
                            bot.sendChat('/me Skipping this video because it is not available or embeddable.');
                            bot.moderateForceSkip();
                        }
                    });
                }

                song.updateAttributes(songData);
                writeRoomState(song.permalink);
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


        // Check for active mods
        roomHasActiveStaff = false;

        // @FIXME - This should probably be recoded using Promise.all so it's in order
        var idleDJs = [];
        Promise.map(bot.getUsers(), function (dj) {
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

                        if (botUser.db.id !== dbUser.id && dbUser.role > 1 && (secondsSince(dbUser.last_active) <= 300 || position >= 0)) {
                            console.log('[STAFF-ACTIVE]', dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                            roomHasActiveStaff = true;
                        }

                        if (position < 1) {
                            // Don't do anything, user is not in line
                        }
                        else if (settings.djidle && secondsSince(dbUser.last_active) >= settings.maxdjidletime && moment.utc().isAfter(moment.utc(startupTimestamp).add(config.queue.djIdleAfterMins, 'minutes'))) {
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

            var message = '';
            var logMessage = '';

            // Check if the song is too long for room settings.  Then check to see if it's blacklisted
            if (config.queue.maxSongLengthSecs > 0 && data.media.duration > config.queue.maxSongLengthSecs) {
                logMessage = '[SKIP] Skipped ' + data.currentDJ.username + ' spinning a song of ' + data.media.duration + ' seconds';
                console.log(logMessage);
                sendToSlack(logMessage);
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
                        mod_user_id: botUser.db.id
                    };
                    models.Karma.create(userData);
                });
            }
            else {
                models.Song.find({
                    where: {
                        site: config.site,
                        host: data.media.format,
                        host_id: data.media.cid
                    }
                }).then(function (row) {
                    if (row !== null) {
                        if (row.is_banned) {
                            logMessage = '[SKIP] Skipped ' + data.currentDJ.username + ' spinning a blacklisted song: ' + data.media.name + ' (id: ' + data.media.id + ')';
                            message = 'Sorry @' + data.currentDJ.username + ', this video has been blacklisted in our song database.';
                            if (row.banned_reason) {
                                message += ' (' + row.banned_reason + ')';
                                logMessage += ' (' + row.banned_reason + ')';
                            }
                            console.log(logMessage);
                            sendToSlack(logMessage);
                            bot.sendChat(message);
                            bot.moderateForceSkip();
                            getDbUserFromSiteUser(data.currentDJ, function (dbuser) {
                                var userData = {
                                    type: 'skip',
                                    details: 'Skipped for playing a blacklisted song: ' + data.media.name + ' (id: ' + data.media.id + ')',
                                    user_id: dbuser.id,
                                    mod_user_id: botUser.db.id
                                };
                                models.Karma.create(userData);
                            });
                        } else if (row.release_date != null && config.queue.minSongReleaseDate != null && config.queue.maxSongReleaseDate != null) {
                            if (moment(row.release_date).isBefore(config.queue.minSongReleaseDate) || moment(row.release_date).isAfter(config.queue.maxSongReleaseDate)) {
                                var releaseYear = moment(row.release_date).format("Y");
                                logMessage = '[SKIP] Skipped ' + data.currentDJ.username + ' spinning an out-of-range song from ' + releaseYear + ': ' + data.media.name + ' (id: ' + data.media.id + ')'
                                message = 'Sorry @' + data.currentDJ.username + ', this song is out of range for the current theme (' + releaseYear + ').';
                                console.log(logMessage);
                                sendToSlack(logMessage);
                                bot.sendChat(message);
                                bot.moderateForceSkip();
                                getDbUserFromSiteUser(data.currentDJ, function (dbuser) {
                                    var userData = {
                                        type: 'skip',
                                        details: 'Skipped for playing an out-of-range song: ' + data.media.name + ' (id: ' + data.media.id + ')',
                                        user_id: dbuser.id,
                                        mod_user_id: botUser.db.id
                                    };
                                    models.Karma.create(userData);
                                });
                            }
                        }

                    }
                });
            }

            if (moment.utc().isAfter(moment.utc(startupTimestamp).add(5, 'minutes'))) {
                if (roomHasActiveStaff && (settings.rdjplus || settings.bouncerplus)) {
                    bot.sendChat('/me Active @staff detected. Revoking temporary extra permissions @rdjs');
                    settings.rdjplus = false;
                    settings.bouncerplus = false;
                }
                else if (!roomHasActiveStaff && (!settings.rdjplus || !settings.bouncerplus)) {
                    bot.sendChat('/me No active @staff detected. Granting Bouncers and @rdjs temporary extra permissions');
                    settings.rdjplus = true;
                    settings.bouncerplus = true;
                }
            }

        });
        saveWaitList(true);

        var waitListSize = bot.getWaitList().length;

        if (waitListSize >= settings.djidleminqueue && settings.djidle == false) {
            config.queue.djIdleMinQueueLengthToEnforce = settings.djidleminqueue;
            settings.djidle = true;
            bot.sendChat('/me Wait List at ' + waitListSize + ' @djs.  Idle timer enabled and cycle disabled');
            bot.changeDJCycle(false);
        } else if (waitListSize < settings.djidleminqueue && settings.djidle == true) {
            config.queue.djIdleMinQueueLengthToEnforce = 999;
            settings.djidle = false;
            bot.sendChat('/me Wait List at ' + waitListSize + ' @djs.  Idle timer disabled and cycle enabled');
            bot.changeDJCycle(true);
        }


    });
};