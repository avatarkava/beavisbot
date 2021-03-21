module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_WLBAN, function (data) {

        if (config.verboseLogging) {
            console.log('[EVENT] modWaitlistBan ', JSON.stringify(data, null, 2));
        }

        if (data.user == undefined) {
            console.log('[WARNING] data.user was undefined in modWaitlistBan event');
            return;
        }

        var duration = 'unknown';
        switch (data.duration) {
            case 'Short':
                duration = '15 min';
                break;
            case 'Medium':
                duration = '30 min';
                break;
            case 'Long':
                duration = '45 min';
                break;
            case 'Forever':
                duration = 'forever';
                break;
            default:
                // maybe this is an unmute?
                break;
        }

        getDbUserFromUsername(data.user.username, function (dbUser) {
            var message;
            if (duration == 'unknown') {
                message = '[WLUNBAN] ' + data.user.username + ' (ID: ' + data.user.id + ') was unbanned from the waitlist by ' + data.moderator.username;
            } else if (dbUser == null) {
                message = '[WLBAN] ' + data.user.username + ' (ID: ' + data.user.id + ') was banned from the waitlist for ' + duration + ' by ' + data.moderator.username;
            } else {
                message = '[WLBAN] ' + data.user.username + ' (ID: ' + data.user.id + ', LVL: ' + dbUser.site_points + ') was banned from the waitlist for ' + duration + ' by ' + data.moderator.username;
            }
            console.log(message);
            sendToWebhooks(message);
        });
    });

};
