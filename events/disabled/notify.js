module.exports = function (bot) {

    bot.on(PlugAPI.events.NOTIFY, function (data) {
        console.log('[EVENT] notify ', JSON.stringify(data, null, 2));
    });
    
};
