module.exports = function (bot) {

    bot.on(PlugAPI.events.MAINT_MODE, function (data) {
        console.log('[EVENT] plugMaintenance ', JSON.stringify(data, null, 2));
    });
    
};
