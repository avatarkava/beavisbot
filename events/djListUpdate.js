module.exports = function (bot) {

    bot.on(PlugAPI.events.DJ_LIST_UPDATE, function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] djListUpdate ', JSON.stringify(data, null, 2));
        }
        saveWaitList(false);

        data.forEach(function (listUser) {
            getDbUserFromSiteUser(listUser, function (row) {
                remove = false;
                var banLength = bot.WLBAN.SHORT;

                if (listUser['role'] == 0 && listUser['gRole'] == 0 && listUser['level'] < config.queue.djMinLevel) {
                    logMessage = '[REMOVE] Removed ' + listUser.username + ' joining the wait list below minimum level ' + config.queue.djMinLevel;
                    message = 'Sorry @' + listUser.username + ', this community does not allow joining the wait list until you reach level ' + config.queue.djMinLevel + '. Enjoy listening until then!';
                    banLength = bot.WLBAN.SHORT;
                    remove = true;
                } else {
                    // @TODO - This is not really needed thanks to the waitlist ban function on plug
                    if (secondsUntil(row.dj_timeout_until) > 0) {
                        expiry = moment.utc(row.dj_timeout_until).format('MMM DD, YYYY') + ' at ' + moment.utc(row.dj_timeout_until).format('h:mmA') + ' UTC';
                        logMessage = '[REMOVE] Removed ' + listUser.username + ' joining the wait list while timed out until ' + expiry;
                        message = 'Sorry @' + listUser.username + ', you are prohibited from entering the wait list until ' + expiry + ' ' + timeUntil(row.dj_timeout_until) + '. Enjoy listening until then!';
                        banLength = bot.WLBAN.SHORT;
                        remove = true;
                    }
                }

                if (remove) {
                    console.log(logMessage);
                    sendToWebhooks(logMessage);
                    bot.sendChat(message);
                    bot.moderateWaitListBan(row.site_id, bot.WLBAN_REASON.INAPPROPRIATE_GENRE, banLength);
                    models.User.update({
                        queue_position: -1
                    }, {
                        where: {
                            id: row.id
                        }
                    });

                    var data = {
                        type: 'ban',
                        details: 'Banned ' + row.username + ' from the wait list',
                        username: row.username,
                        site_id: listUser.id,
                        user_id: row.id,
                        mod_user_id: botUser.db.id,
                        message: '[WLBAN] Banned ' + row.username + ' from the wait list for 15 minutes (' + banLength + ')'
                    }
                    addKarma(data);
                }
            });
        });

    });
    
}