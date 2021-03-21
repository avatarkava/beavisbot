module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_STAFF, function (data) {
        console.log('[EVENT] modStaff ', JSON.stringify(data, null, 2));
    });
    
};
