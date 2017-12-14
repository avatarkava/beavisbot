module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_AMBASSADOR, function (data) {
        console.log('[EVENT] modAmbassador ', JSON.stringify(data, null, 2));
    });
    
};
