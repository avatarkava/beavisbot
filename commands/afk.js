exports.names = ['.afk','.afkdjs'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (data.from.role > 1 && config.activeDJTimeoutMins > 0) {

        var maxIdleTime = config.activeDJTimeoutMins * 60;
        var idleDJs = [];
        var z = 0;

        waitlist = bot.getDJs();
        waitlist.forEach(function(dj) {
            db.get("SELECT strftime('%s', 'now')-strftime('%s', lastActive) AS 'secondsSinceLastActive', lastActive, username FROM USERS WHERE userid = ?", [dj.id] , function (error, row) {
                z++;
                if (row != null) {
                    if(row.secondsSinceLastActive >= maxIdleTime) {
                        logger.warning('[IDLE] ' + z + '. ' + row.username + ' last active ' + timeSince(row.lastActive));
                        idleDJs.push(row.username + ' (' + timeSince(row.lastActive, true) + ')');
                    }
                    else {
                        logger.info('[ACTIVE] ' + z + '. ' + row.username + ' last active ' + timeSince(row.lastActive));
                    }

                    if (z == waitlist.length) {
                        if(idleDJs.length > 0) {
                            var idleDJsList = idleDJs.join(' • ');
                            bot.sendChat('Currently idle: ' + idleDJsList);
                        }
                        else {
                            bot.sendChat('Everyone\'s currently active! :thumbsup:');
                        }
                    }
                }
            });
        });

    }
};
