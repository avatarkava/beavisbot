module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_WLBAN, function (data) {
        console.log('[EVENT] modWaitlistBan ', JSON.stringify(data, null, 2));
    });
    
};
