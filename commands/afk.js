exports.names = ['.afk'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1 && config.activeDJTimeoutMins > 0) {
        maxIdleTime = config.activeDJTimeoutMins * 60;

        // Start at slot 1 (skip the current DJ)
        for (i = 1; i < room.djs.length; i++) {
            dj = room.djs[i].user;
            db.get("SELECT strftime('%s', 'now')-strftime('%s', lastSeen) AS 'secondsSinceLastVisit', lastSeen, username FROM USERS WHERE userid = ?", [dj.id] , function (error, row) {
                if (row != null) {
                    if(row.secondsSinceLastVisit >= maxIdleTime) {
                        console.log('[IDLE] ' + row.username + ' visited '+ row.secondsSinceLastVisit + ' seconds ago (' + row.lastSeen + ')');
                    }
                    else {
                        console.log('[ACTIVE] ' + row.username + ' visited '+ row.secondsSinceLastVisit + ' seconds ago (' + row.lastSeen + ')');
                    }
                }
            });
        }
    }
};
