module.exports = function (bot) {

    bot.on(PlugAPI.events.ROOM_WELCOME_UPDATE, function (data) {
        console.log('[EVENT] roomWelcomeUpdate ', JSON.stringify(data, null, 2));
    });
    
};
