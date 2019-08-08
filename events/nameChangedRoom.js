module.exports = function (bot) {

    bot.on(PlugAPI.events.FORCE_NAME_CHANGE, function (data) {
        console.log('[EVENT] nameChangedRoom ', JSON.stringify(data, null, 2));
    });
    
};