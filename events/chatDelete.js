module.exports = function (bot) {

    bot.on(PlugAPI.events.CHAT_DELETE, function (data) {
        console.log('[EVENT] chatDelete ', JSON.stringify(data, null, 2));
    });
    
};