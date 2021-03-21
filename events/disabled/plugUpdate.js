module.exports = function (bot) {

    bot.on(PlugAPI.events.PDJ_UPDATE, function (data) {
        console.log('[EVENT] plugUpdate ', JSON.stringify(data, null, 2));
    });
    
};
