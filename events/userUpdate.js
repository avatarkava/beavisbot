module.exports = function (bot) {

    bot.on(PlugAPI.events.USER_UPDATE, function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] userUpdate', data);
        }
    });

};
