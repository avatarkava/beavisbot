module.exports = function (bot) {

    bot.on(PlugAPI.events.GRAB, function (data) {

        user = bot.getUser(data);

        if (config.verboseLogging) {
            console.log('[GRAB] ' + JSON.stringify(data, null, 2));
        } else if (user) {
            console.log('[GRAB]', user.username + ' grabbed this song');
        }
    });

};
