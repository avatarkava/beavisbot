module.exports = function (bot) {
    bot.on('djListUpdate', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] djListUpdate ', JSON.stringify(data, null, 2));
        }
        saveWaitList(false);

        data.forEach(function (listUser) {
            if (listUser['role'] == 0 && listUser['gRole'] == 0 && listUser['level'] < config.queue.djMinLevel) {
                logMessage = '[REMOVE] Removed ' + listUser.username + ' joining the wait list below minimum level ' + config.queue.djMinLevel;
                message = 'Sorry @' + listUser.username + ', this community does not allow joining the wait list until you reach level ' + config.queue.djMinLevel + '.';
                console.log(logMessage);
                sendToSlack(logMessage);
                bot.sendChat(message);
                bot.moderateRemoveDJ(listUser.id);
            } else {
                getDbUserFromSiteUser(listUser, function (row) {
                    if (secondsUntil(row.dj_timeout_until) > 0) {
                        expiry = moment.utc(row.dj_timeout_until).format('MMM DD, YYYY') + ' at ' + moment.utc(row.dj_timeout_until).format('h:mmA') + ' UTC';
                        logMessage = '[REMOVE] Removed ' + listUser.username + ' joining the wait list while timed out until ' + expiry;
                        message = 'Sorry @' + listUser.username + ', you are prohibited from entering the wait list until ' + expiry + ' ' + timeUntil(row.dj_timeout_until);
                        console.log(logMessage);
                        sendToSlack(logMessage);
                        bot.sendChat(message);
                        bot.moderateRemoveDJ(listUser.id);
                    }
                });
            }
        });

    });
}
