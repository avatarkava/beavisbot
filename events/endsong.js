module.exports = function () {
  bot.on("endsong", function (data) {
    const song = data.room.metadata.current_song;
    if (song.source == "yt") {
      song.source = "youtube";
    }

    if (config.verboseLogging) {
      console.log("[SONG END]", JSON.stringify(data, null, 2));
    } else {
      console.log(`[SONG END] ${song.djname} (${song.djid}) played: ${song.metadata.artist} - ${song.metadata.song} (${song.source}: ${song.sourceid})`);
    }

    // Write current song data to DB
    const songData = {
      author: song.metadata.artist,
      title: song.metadata.song,
      name: song.metadata.artist + " - " + song.metadata.song,
      host: song.source,
      host_id: song.sourceid,
      duration: song.metadata.length,
      image: song.metadata.coverart,
    };

    models.Song.upsert(songData, { returning: true })
    .then(() => {
      let userRecord = models.User.findOne({ where: { site: config.site, site_id: song.djid } });
      let songRecord = models.Song.findOne({ where: { host: song.source, host_id: song.sourceid } });
      return Promise.all( [userRecord, songRecord]);
    }).then(([userRecord, songRecord]) => {
      
        if (!userRecord) throw new Error('No user found to associate on song insertion');
        if (!songRecord) throw new Error('No song found - maybe the insert failed?');        
        
        songRecord.createPlay({
          UserId: userRecord.dataValues.id,
          site: config.site,
          positive: data.room.metadata.upvotes,
          negative: data.room.metadata.downvotes,
          grabs: roomState.snags,
          listeners: data.room.metadata.listeners,
          skipped: false, // @FIXME any way to detect this?
        });

        transferCustomPoints(null, song.djid, roomState.snags);
        //writeRoomState();
        
      })      
      .catch((err) => console.log("[ERROR]", err));
  });
};
