module.exports = function (bot) {

    bot.on(PlugAPI.events.BAN, function (data) {
        console.log('[EVENT] ban ', JSON.stringify(data, null, 2));
    });
    
};