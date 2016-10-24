module.exports = function (bot) {
    bot.on('command', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] command ', JSON.stringify(data, null, 2));
        }
    });
};