module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_MOVE_DJ, function (data) {
        console.log('[EVENT] modMoveDJ ', JSON.stringify(data, null, 2));
    });
    
};
