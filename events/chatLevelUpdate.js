module.exports = function (bot) {

    bot.on(PlugAPI.events.CHAT_LEVEL_UPDATE, function (data) {
        console.log('[EVENT] roomMinChatLevelUpdate ', JSON.stringify(data, null, 2));
    });
    
};
