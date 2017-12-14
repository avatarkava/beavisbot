module.exports = function (bot) {

    bot.on(PlugAPI.events.DJ_LIST_CYCLE, function (data) {
        console.log('[EVENT] djListCycle ', JSON.stringify(data, null, 2));
    });
};