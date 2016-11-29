module.exports = function (bot) {
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
                    if (!roomHasActiveStaff) {
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
                        where: {event_type: 'userJoin', pattern: dbUser.username, is_active: true},
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
                            bot.sendChat('put @' + data.username + ' back in line (reconnected after ' + timeSince(dbUser.last_seen, true) + ') :thumbsup:')
                        }, 5000);

                    });
                }
            });
            updateDbUser(data);
        }
    });
};