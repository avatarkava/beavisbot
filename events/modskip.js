module.exports = function (bot) {

    bot.on('modSkip', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] modSkip ', JSON.stringify(data, null, 2));
        }

        // Send this if the skip didn't come via [SKIP]
        if (data.mi != botUser.db.site_id) {
            message = '[SKIP] ' + data.m + ' skipped a song.';
            console.log(message + ' ' + JSON.stringify(data, null, 2));
            sendToSlack(message);
        }

        // Data from last song played
        var skippedSong = bot.lastPlay;
        message = '[SKIP] Skipped song: ' + skippedSong.media.name + ' (https://www.youtube.com/watch?v=' + skippedSong.media.cid + ') played by ' + skippedSong.dj.username + ' (ID: ' + skippedSong.dj.id + ')';
        console.log('[SKIP] ' + JSON.stringify(skippedSong, null, 2));
        sendToSlack(message);
    });
};