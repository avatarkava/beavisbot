module.exports = function(bot) {
    
    bot.on(PlugAPI.events.MODERATE_BAN, function (data) {

        if (config.verboseLogging) {
            console.log('[EVENT] modBan ', JSON.stringify(data, null, 2));
        }

        var duration = 'unknown';
        switch (data.duration) {
            case 'Hour':
                duration = '1 hour';
                break;
            case 'Day':
                duration = '1 day';
                break;
            case 'Forever':
                duration = 'forever';
                break;
        }

        getDbUserFromUsername(data.user, function (dbUser) {
            var message;
            if (dbUser == null) {
                message = '[BAN] ' + data.user + ' was banned for ' + duration + ' by ' + data.moderator.username;
            } else {
                message = '[BAN] ' + data.user + ' (ID: ' + dbUser.site_id + ', LVL: ' + dbUser.site_points + ') was banned for ' + duration + ' by ' + data.moderator.username;
            }
            console.log(message);
            sendToWebhooks(message);

            getDbUserFromUsername(data.moderator.username, function (modUser) {
                var userData = {
                    type: 'ban',
                    details: 'Banned for ' + duration + ' by ' + data.moderator.username,
                    user_id: dbUser.id,
                    mod_user_id: modUser.id
                };
                models.Karma.create(userData);
            });
        });

    });
};