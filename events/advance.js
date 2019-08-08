module.exports = function (bot) {

    bot.on(bot.events.ADVANCE, function (data) {

        if (config.verboseLogging) {
            console.log('[EVENT] advance', JSON.stringify(data, null, 2));
        } else {
            console.log('[EVENT] advance');
        }

        // Save the last song's data to the DB
        saveLastSong(data.lastPlay);

        // the history endpoint from plug doesn't have the last song played, so we will need to get it another way
        bot.lastPlay = data.lastPlay;
        bot.mediaHistory = bot.getHistory();

        if (data.media == undefined || data.currentDJ == undefined) {
            console.log('[WARNING] Data or currentDJ was undefined in advance.js');
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

        if (config.queue.upvoteSongs == 'ALL') {
            bot.woot();
        }

        models.Play.findOne({
            include: [{
                model: models.Song,
                where: {$and: [{site: config.site}, {host: data.media.format}, {host_id: data.media.cid}]}
            }, models.User],
            order: [['created_at', 'DESC']]
        }).then(function (row) {
            if (!row) {
                bot.sendChat('This is the first time I have seen this video of "' + data.media.author + ' - ' + data.media.title + '"  played!');
            } else {
                message = row.Song.name + ' • last played ' + timeSince(row.created_at) + ' by ' + row.User.username + ' • ' + row.listeners + ' :ear: • ' + row.positive + ' :+1: • ' + row.grabs + ' :star: • ' + row.negative + ' :-1:';
                bot.sendChat(message);
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
                    sendToWebhooks(message);
                    bot.sendChat('Skipping ' + data.media.name + ' because it appears to be stuck...');
                    bot.moderateForceSkip();
                }
            }, (nextTimerDelay));
        }

        if (data.media.format == 1 && config.apiKeys.youtube.client_id !== undefined) {
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

                        // See if this channel is blacklisted
                        models.Blacklist.find(
                            {where: {$and: [{type: 'channel'}, {is_active: true}, {pattern: item.snippet.channelId}]}}
                        ).then(function (row) {
                            if (row) {
                                banned = true;
                            }

                            if (banned) {
                                bot.moderateBanUser(data.currentDJ.id, PlugAPI.BAN_REASON.OFFENSIVE_MEDIA, PlugAPI.BAN.PERMA);
                                bot.sendChat('NOOOOOOOOOPE. https://media.giphy.com/media/9wBub5vhSsTDi/giphy.gif');
                                models.Song.update({is_banned: 1}, {where: {host_id: data.media.cid}});
                                var message = '[SKIPBAN] Song https://youtu.be/' + data.media.cid + ' skipped and ' + data.currentDJ.username + '(ID: ' + data.currentDJ.id + ') banned because they used a song from a blacklisted channel.';
                                console.log(message);
                                sendToWebhooks(message);
                            } else if (!available) {
                                var message = '[SKIP] Song was skipped because it is not available or embeddable';
                                console.log(message);
                                sendToWebhooks(message);
                                bot.sendChat('@' + data.currentDJ.username + ', skipping this video because it is not available or embeddable. Please update your playlist!');
                                bot.moderateForceSkip();
                            } else if (lowViewCount) {
                                var message = '[YOUTUBE] The current video played has very few views. You may want to check it for :trollface:... ' + data.media.name + ' (https://youtu.be/' + data.media.cid + ') played by ' + data.currentDJ.username + ' (ID: ' + data.currentDJ.id + ')';
                                console.log(message);
                                sendToWebhooks(message);
                            }
                        });
                    }
                } else {
                    console.log(err);
                }
            });
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
                if (song.is_banned) {
                    logMessage = '[SKIP] Skipped ' + data.currentDJ.username + ' spinning a blacklisted song: ' + data.media.name + ' (id: ' + data.media.id + ')';
                    message = 'Sorry @' + data.currentDJ.username + ', this video has been blacklisted in our song database.';
                    if (song.banned_reason) {
                        message += ' (' + song.banned_reason + ')';
                        logMessage += ' (' + song.banned_reason + ')';
                    }
                    console.log(logMessage);
                    sendToWebhooks(logMessage);
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
                } else if (song.release_date != null && config.queue.minSongReleaseDate != null && config.queue.maxSongReleaseDate != null) {
                    if (moment(song.release_date).isBefore(config.queue.minSongReleaseDate) || moment(song.release_date).isAfter(config.queue.maxSongReleaseDate)) {
                        var releaseYear = moment(song.release_date).format("Y");
                        logMessage = '[SKIP] Skipped ' + data.currentDJ.username + ' spinning an out-of-range song from ' + releaseYear + ': ' + data.media.name + ' (id: ' + data.media.id + ')'
                        message = 'Sorry @' + data.currentDJ.username + ', this song is out of range for the current theme (' + releaseYear + ').';
                        console.log(logMessage);
                        sendToWebhooks(logMessage);
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
                } else if (config.queue.maxSongLengthSecs > 0 && data.media.duration > config.queue.maxSongLengthSecs) {
                    // Check if the song is too long for room settings.  Then check to see if it's blacklisted
                    logMessage = '[SKIP] Skipped ' + data.currentDJ.username + ' spinning a song of ' + data.media.duration + ' seconds';
                    console.log(logMessage);
                    sendToWebhooks(logMessage);
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
                } else if (data.media.duration == 0) {
                    console.log('[ZEROLENGTH] Song was advanced by the site because it reported a duration of 0');
                    bot.sendChat('@' + data.currentDJ.username + ', this song was reported as 0:00 long. Please check your playlist or try .zerolength for more info.');
                } else if (data.media.format == 1) {
                    song.permalink = 'https://youtu.be/' + data.media.cid;
                } else if (data.media.format == 2) {
                    soundcloud_get_track(data.media.cid, function (json_data) {
                        song.permalink = json_data.permalink_url;

                        if (!json_data.streamable) {
                            console.log('[SKIP] Song was skipped because it is not available or embeddable');
                            bot.sendChat('Skipping this video because it is not available or embeddable.');
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

        idleWaitListProcess();


    });
};