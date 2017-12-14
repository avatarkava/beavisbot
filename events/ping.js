module.exports = function (bot) {

    bot.on(PlugAPI.events.PING, function (data) {
        console.log('[EVENT] ping ', JSON.stringify(data, null, 2));
    });
    
};
