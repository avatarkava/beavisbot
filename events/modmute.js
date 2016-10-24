module.exports = function (bot) {
    bot.on('modMute', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] modMute ', JSON.stringify(data, null, 2));
        }

        var duration = 'unknown';
        switch (data.d) {
            case 's':
                duration = '15';
                break;
            case 'm':
                duration = '30';
                break;
            case 'l':
                duration = '45';
                break;
        }

        getDbUserFromUsername(data.t, function (dbUser) {
            var message;
            if (dbUser == null) {
                message = '[MUTE] ' + data.t + ' (ID: ' + data.i + ') was muted for ' + duration + ' minutes by ' + data.m;
                message = '[MUTE] ' + data.t + ' (ID: ' + data.i + ') was muted for ' + duration + ' minutes by ' + data.m;
            } else {
                message = '[BAN] ' + data.t + ' (ID: ' + data.i + ', LVL: ' + dbUser.site_points + ') was muted for ' + duration + ' minutes by ' + data.m;
            }
            console.log(message);
            sendToSlack(message);
        });
    });
};