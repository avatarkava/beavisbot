module.exports = function (bot) {

    bot.on(PlugAPI.events.KILL_SESSION, function (data) {
        console.log('[EVENT] killSession ', JSON.stringify(data, null, 2));
    });
    
};
