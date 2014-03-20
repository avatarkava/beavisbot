exports.names = ['.afk'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1 && config.activeDJTimeoutMins > 0) {

        var maxIdleTime = config.activeDJTimeoutMins * 60;
        var idleDJs = [];

        for (i = 0; i < room.djs.length; i++) {
            var dj = room.djs[i].user;
            db.get("SELECT strftime('%s', 'now')-strftime('%s', lastSeen) AS 'secondsSinceLastVisit', lastSeen, username FROM USERS WHERE userid = ?", [dj.id] , function (error, row) {
                if (row != null) {
                    if(row.secondsSinceLastVisit >= maxIdleTime) {
                        console.log('[IDLE] ' + row.username + ' visited '+ timeSince(row.lastSeen) + ' ago');
                        idleDJs.push(row.username + ' (' + timeSince(row.lastSeen) + ')');
                    }
                    else {
                        console.log('[ACTIVE] ' + row.username + ' visited '+ timeSince(row.lastSeen) + ' ago');
                    }
                }
            });

        }

        if (idleDJs.length > 0) {
            var idleDJsList = idleDJs.join(', ');
            bot.chat('Currently idle: ' + idleDJsList);
        }

    }
};
