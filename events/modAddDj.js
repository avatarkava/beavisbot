module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_ADD_DJ, function (data) {
        console.log('[EVENT] modAddDJ ', JSON.stringify(data, null, 2));
    });
};
