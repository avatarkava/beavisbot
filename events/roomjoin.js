module.exports = function (bot) {
    bot.on('roomJoin', function (data) {
        console.log('[EVENT] Ready - joined room: ' + config.roomName);
        if (config.verboseLogging) {
            console.log('[INIT] Room data: ' + JSON.stringify(data, null, 2));
        }

        botUser = bot.getSelf();

        getDbUserFromSiteUser(botUser, function (row) {
            botUser.db = row;
        });

        writeConfigState();

        if (config.verboseLogging) {
            console.log('[INIT] Data loaded for ' + botUser.username + '\n ' + JSON.stringify(botUser, null, 2));
        }

        if (config.responses.botConnect !== "") {
            bot.sendChat(config.responses.botConnect);
        }

        bot.getUsers().forEach(function (user) {
            updateDbUser(user);
        });

        if (config.queue.upvoteSongs == 'ALL') {
            bot.woot();
        }

        if (config.queue.djIdleAfterMins > 0) {
            setInterval(monitorDJList, 5000);
        }
    });
};