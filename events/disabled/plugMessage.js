module.exports = function (bot) {

    bot.on(PlugAPI.events.PDJ_MESSAGE, function (data) {
        console.log('[EVENT] plugMessage ', JSON.stringify(data, null, 2));
    });
    
};
