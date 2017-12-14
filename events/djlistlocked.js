module.exports = function (bot) {
    
    bot.on(PlugAPI.events.DJ_LIST_LOCKED, function (data) {
        console.log('[EVENT] djListLocked ', JSON.stringify(data, null, 2));
    });
    
};