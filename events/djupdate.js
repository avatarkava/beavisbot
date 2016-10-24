module.exports = function (bot) {
    bot.on('djUpdate', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] djUpdate ', JSON.stringify(data, null, 2));
        }
    });
};