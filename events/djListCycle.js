module.exports = function (bot) {

    bot.on(PlugAPI.events.DJ_LIST_CYCLE, function (data) {

        if (config.verboseLogging) {
            console.log('[EVENT] djListCycle ', JSON.stringify(data, null, 2));
        }

        if (data.cycle == true) {
            console.log('[EVENT] DJ Cycle was enabled by ' + data.user.username);
        } else {
            console.log('[EVENT] DJ Cycle was disabled by ' + data.user.username);
        }
    });
};