module.exports = function (bot) {

    bot.on(PlugAPI.events.FRIEND_REQUEST, function (data) {
        console.log('[EVENT] friendRequest ', JSON.stringify(data, null, 2));
    });
    
};