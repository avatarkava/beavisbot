module.exports = function (bot) {
    bot.on('djListUpdate', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] djListUpdate ', JSON.stringify(data, null, 2));
        }
        saveWaitList(false);
    });
}
