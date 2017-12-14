module.exports = function (bot) {

    bot.on(PlugAPI.events.GIFTED_EARN, function (data) {
        console.log('[EVENT] gift ', JSON.stringify(data, null, 2));
    });
    
};