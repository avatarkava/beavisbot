module.exports = function (bot) {

    bot.on(PlugAPI.events.MODERATE_REMOVE_DJ, function (data) {
        console.log('[EVENT] modRemoveDJ ', JSON.stringify(data, null, 2));
        saveWaitList(true);
    });

};