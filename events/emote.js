module.exports = function (bot) {
    bot.on('emote', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] emote ', JSON.stringify(data, null, 2));
        }
    });
};