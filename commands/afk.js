exports.names = ['.afk', '.afkdjs'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1 && config.activeDJTimeoutMins > 0) {

        var maxIdleTime = config.activeDJTimeoutMins * 60;
        idleDJs = [];
        z = 0;

        waitlist = bot.getDJs();
        logger.warning(JSON.stringify(waitlist, null, 2));

        Promise.map(bot.getWaitList(), function (dj) {
            return User.find({where: {id: dj.id}}).on('success', function (dbUser) {
                var position = bot.getWaitListPosition(dj.id);
                if (dbUser !== null) {
                    if (secondsSince(dbUser.last_active) >= maxIdleTime && moment.utc().isAfter(moment.utc(startupTimestamp).add(config.activeDJTimeoutMins, 'minutes'))) {
                        logger.warning('[IDLE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                        idleDJs.push(dbUser.username);

                    }
                    else {
                        logger.info('[ACTIVE]', position + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
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