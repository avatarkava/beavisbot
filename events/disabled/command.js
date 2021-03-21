module.exports = function (bot) {
    
    bot.on(PlugAPI.events.COMMAND, function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] command ', JSON.stringify(data, null, 2));
        }
    });

    bot.on(PlugAPI.events.CHAT_COMMAND, function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] command (via CHAT_COMMAND) ', JSON.stringify(data, null, 2));
        }
    });
};