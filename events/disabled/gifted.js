module.exports = function (bot) {

    bot.on(PlugAPI.events.GIFTED, function (data) {
        console.log('[EVENT] gifted ', JSON.stringify(data, null, 2));
    });
    
};