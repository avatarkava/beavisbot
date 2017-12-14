module.exports = function (bot) {

    bot.on(PlugAPI.events.SKIP, function (data) {
        console.log('[EVENT] skip ', JSON.stringify(data, null, 2));
    });
    
};
