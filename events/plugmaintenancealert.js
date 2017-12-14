module.exports = function (bot) {

    bot.on(PlugAPI.events.MAINT_MODE_ALERT, function (data) {
        console.log('[EVENT] plugMaintenanceAlert ', JSON.stringify(data, null, 2));
    });
    
};
