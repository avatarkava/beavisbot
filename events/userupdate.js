module.exports = function (bot) {
    bot.on('userUpdate', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] USER_UPDATE', data);
        }
    });
};
