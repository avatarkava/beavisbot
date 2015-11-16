exports.names = ['idle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');

    if (bot.hasPermission(bot.getUser(data.user.id), 'queue-order') && config.activeDJTimeoutMins > 0) {

        if (input.length >= 2) {
            var username = _.rest(input, 1);
            var usernameFormatted = S(username).chompLeft('@').s;

            models.User.update({last_active: new Date(), last_seen: new Date()}, {where: {username: usernameFormatted}});
            bot.sendChat("reset the idle timer for " + usernameFormatted);
            console.log('[IDLE]', data.from.username + ' reset the idle timer for ' + usernameFormatted);


        }
        else if (secondsSince(startupTimestamp) < config.activeDJTimeoutMins * 60) {
            bot.sendChat("I've been connected less than " + config.activeDJTimeoutMins + " minutes");
        }
        else {
            var maxIdleTime = config.activeDJTimeoutMins * 60;
            idleDJs = [];

            Promise.map(bot.getUsers(), function (dj) {
                return models.User.find({where: {site_id: dj.id}}).then(function (dbUser) {
                    var position = -1;
                    //var position = bot.getWaitListPosition(dj.id);
                    if (dbUser !== null) {
                        if (secondsSince(dbUser.last_active) >= maxIdleTime && moment.utc().isAfter(moment.utc(startupTimestamp).add(config.activeDJTimeoutMins, 'minutes'))) {
                            console.log('[WL-IDLE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                            idleDJs.push(dbUser.username);

                        }
                        else {
                            console.log('[WL-ACTIVE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                        }
                    }
                });
            }).then(function () {
                if (idleDJs.length > 0) {
                    var idleDJsList = idleDJs.join(' • ');
                    bot.sendChat("Currently idle: " + idleDJsList);
                }
                else {
                    bot.sendChat("Everyone's currently active! :thumbsup:");
                }
            });
        }
    }
}