module.exports = function (bot) {

    bot.on(PlugAPI.events.ROOM_NAME_UPDATE, function (data) {
        console.log('[EVENT] roomNameUpdate ', JSON.stringify(data, null, 2));
    });
    
};
