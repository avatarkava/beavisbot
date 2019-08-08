module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_SKIP, function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] modSkip ', JSON.stringify(data, null, 2));
        }

        // Send this if the skip didn't come via [SKIP]
        if (data.user.id != botUser.db.site_id) {
            message = '[SKIP] ' + data.user.username + ' skipped a song.';
            console.log(message);
            sendToWebhooks(message);
        }

        // Data from last song played
        var skippedSong = bot.lastPlay;
        message = '[SKIP] Skipped song: ' + skippedSong.media.name + ' (https://www.youtube.com/watch?v=' + skippedSong.media.cid + ') played by ' + skippedSong.dj.username + ' (ID: ' + skippedSong.dj.id + ')';

        if (config.verboseLogging) {
            console.log('[SKIP] ' + message, JSON.stringify(skippedSong, null, 2));
        } else {
            console.log('[SKIP] ' + message);
        }
        sendToWebhooks(message);
    });
};