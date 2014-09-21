exports.names = ['.afk', '.afkdjs'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1 && config.activeDJTimeoutMins > 0) {

        var maxIdleTime = config.activeDJTimeoutMins * 60;
        var idleDJs = [];
        var z = 0;

        waitlist = bot.getDJs();

        logger.warning(JSON.stringify(waitlist, null, 2));

        waitlist.forEach(function (dj) {
            User.find(dj.id).success(function (dbUser) {
                z++;
                if (secondsSince(dbUser.last_active) >= maxIdleTime) {
                    logger.warning('[IDLE] ' + z + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                    idleDJs.push(dbUser.username + ' (' + timeSince(dbUser.last_active, true) + ')');
                }
                else {
                    logger.info('[ACTIVE] ' + z + '. ' + dbUser.username + ' last active ' + timeSince(dbUser.last_active));
                }

                if (z === waitlist.length) {
                    if (idleDJs.length > 0) {
                        var idleDJsList = idleDJs.join(' • ');
                        bot.sendChat("Currently idle: " + idleDJsList);
                    }
                    else {
                        bot.sendChat("Everyone's currently active! :thumbsup:");
                    }
                }

            });
        });

    }
};
