module.exports = function (bot) {

    bot.on(PlugAPI.events.ROOM_DESCRIPTION_UPDATE, function (data) {
        console.log('[EVENT] roomDescriptionUpdate ', JSON.stringify(data, null, 2));
    });
    
};
