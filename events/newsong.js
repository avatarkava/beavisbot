module.exports = function () {
  bot.on("newsong", function (data) {

    if (config.verboseLogging) {
      console.log("[SONG START]", JSON.stringify(data, null, 2));
    }    
    
    const song = data.room.metadata.current_song;
    console.log("********************************************************************");
    console.log("[UPTIME]", "Bot online " + timeSince(startupTimestamp, true));
    console.log(`[SONG START] ${song.djname} (${song.djid}) played: ${song.metadata.artist} - ${song.metadata.song} (${song.source}: ${song.sourceid})`);    

    if (config.queue.upvoteSongs == "ALL" && data.room.metadata.current_song) {
      bot.bop();
    }
  });
};
