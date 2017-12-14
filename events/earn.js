module.exports = function (bot) {

    bot.on(PlugAPI.events.EARN, function (data) {
        console.log('[EVENT] earn ', JSON.stringify(data, null, 2));
    });
    
};