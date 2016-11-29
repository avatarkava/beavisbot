exports.names = ['idle'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {

    var input = data.message.split(' ');

    if (config.queue.djIdleAfterMins > 0) {

        if (input.length >= 2) {
            var username = _.rest(input, 1);
            var usernameFormatted = S(username).chompLeft('@').s;

            models.User.update({
                last_active: new Date(),
                last_seen: new Date()
            }, {where: {username: usernameFormatted}});
            bot.sendChat("reset the idle timer for " + usernameFormatted);
            console.log('[IDLE]', data.from.username + ' reset the idle timer for ' + usernameFormatted);


        }
        else if (secondsSince(startupTimestamp) < config.queue.djIdleAfterMins * 60) {
            bot.sendChat("I've been connected less than " + config.queue.djIdleAfterMins + " minutes");
        }
        else {
            var maxIdleTime = config.queue.djIdleAfterMins * 60;
            idleDJs = [];

            Promise.map(bot.getWaitList(), function (dj) {
                return models.User.find({where: {site_id: dj.id}}).then(function (dbUser) {
                    var position = bot.getWaitListPosition(dj.id);
                    if (dbUser !== null) {
                        if (secondsSince(dbUser.last_active) >= maxIdleTime && moment.utc().isAfter(moment.utc(startupTimestamp).add(config.queue.djIdleAfterMins, 'minutes'))) {
                            console.log('[WL-IDLE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                            idleDJs.push(dbUser.username + ' (' + timeSince(dbUser.last_active, true) + ')');

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