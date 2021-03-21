module.exports = function (bot) {

    bot.on(PlugAPI.events.PLAYLIST_CYCLE, function (data) {
        console.log('[EVENT] playlistCycle ', JSON.stringify(data, null, 2));
    });
    
};
