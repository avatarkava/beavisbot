module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_MUTE, function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] modMute ', JSON.stringify(data, null, 2));
        }

        var duration = 'unknown';
        switch (data.duration) {
            case 'Short':
                duration = '15';
                break;
            case 'Medium':
                duration = '30';
                break;
            case 'Long':
                duration = '45';
                break;
            default:
                // maybe this is an unmute?
                break;
        }

        getDbUserFromUsername(data.user.username, function (dbUser) {
            var message;
            if (duration == 'unknown') {
                message = '[UNMUTE] ' + data.user.username + ' (ID: ' + data.user.id + ') was unmuted by ' + data.moderator.username;
            } else if (dbUser == null) {
                message = '[MUTE] ' + data.user.username + ' (ID: ' + data.user.id + ') was muted for ' + duration + ' minutes by ' + data.moderator.username;
            } else {
                message = '[MUTE] ' + data.user.username + ' (ID: ' + data.user.id + ', LVL: ' + dbUser.site_points + ') was muted for ' + duration + ' minutes by ' + data.moderator.username;
            }
            console.log(message);
            sendToSlack(message);
        });
    });
};