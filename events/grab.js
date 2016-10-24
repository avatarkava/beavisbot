module.exports = function (bot) {
    bot.on('grab', function (data) {

        user = bot.getUser(data);

        if (config.verboseLogging) {
            console.log('[VOTE] ' + JSON.stringify(data, null, 2));
        } else if (user) {
            console.log('[GRAB]', user.username + ' grabbed this song');
        }
    });
};
