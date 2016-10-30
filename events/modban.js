module.exports = function(bot) {
    bot.on('modBan', function (data) {

        if (config.verboseLogging) {
            console.log('[EVENT] modBan ', JSON.stringify(data, null, 2));
        }

        var duration = 'unknown';
        switch (data.d) {
            case 'h':
                duration = '1 hour';
                break;
            case 'd':
                duration = '1 day';
                break;
            case 'f':
                duration = 'eternity';
                break;
        }

        getDbUserFromUsername(data.t, function (dbUser) {
            var message;
            if (dbUser == null) {
                message = '[BAN] ' + data.t + ' was banned for ' + duration + ' by ' + data.m;
            } else {
                message = '[BAN] ' + data.t + ' (ID: ' + dbUser.site_id + ', LVL: ' + dbUser.site_points + ') was banned for ' + duration + ' by ' + data.m;
            }
            console.log(message);
            sendToSlack(message);

            getDbUserFromUsername(data.m, function (modUser) {
                var userData = {
                    type: 'ban',
                    details: 'Banned for ' + duration + ' by ' + data.m,
                    user_id: dbUser.id,
                    mod_user_id: modUser.id
                };
                models.Karma.create(userData);
            });
        });

    });
};