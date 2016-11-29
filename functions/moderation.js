module.exports = function (bot) {

    blacklistSongById = function (songid, from) {
        models.Play.findOne({
            include: [{
                model: models.Song,
                where: {$and: [{site: config.site}, {host_id: songid}]}
            }, models.User],
            order: [['created_at', 'DESC']]
        }).then(function (row) {
            if (!row) {
                bot.sendChat('I have not seen a song with id `' + songid + '` played in this room!');
            } else {
                var userData = {
                    type: 'blacklist',
                    details: 'Blacklisted ' + row.Song.name + ' (spun by ' + row.User.username + ')',
                    user_id: row.User.id,
                    mod_user_id: from.db.id
                };
                models.Karma.create(userData);
                models.Song.update({is_banned: 1}, {where: {host_id: songid}});
                bot.sendChat("The song \"" + row.Song.name + "\" has been blacklisted.");
                message = '[BLACKLIST] ' + from.username + ' blacklisted ' + row.Song.name + ' (ID:' + row.Song.host_id + ')';
                console.log(message);
                sendToSlack(message);
            }
        });
    };

    monitorDJList = function () {

    };

    idleWaitListProcess = function () {
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

            if (moment.utc().isAfter(moment.utc(startupTimestamp).add(5, 'minutes'))) {
                if (roomHasActiveStaff && (settings.rdjplus || settings.bouncerplus)) {
                    bot.sendChat('Active @staff detected. Revoking temporary extra permissions @rdjs');
                    settings.rdjplus = false;
                    settings.bouncerplus = false;
                }
                else if (!roomHasActiveStaff && (!settings.rdjplus || !settings.bouncerplus)) {
                    bot.sendChat('No active @staff detected. Granting Bouncers and @rdjs temporary extra permissions');
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
            bot.sendChat('Wait List at ' + waitListSize + ' @djs.  Idle timer enabled and cycle disabled');
            bot.changeDJCycle(false);
        } else if (waitListSize < settings.djidleminqueue && settings.djidle == true) {
            config.queue.djIdleMinQueueLengthToEnforce = 999;
            settings.djidle = false;
            bot.sendChat('Wait List at ' + waitListSize + ' @djs.  Idle timer disabled and cycle enabled');
            bot.changeDJCycle(true);
        }

    };

    removeIfDownvoting = function (mehUsername) {

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
    };
};