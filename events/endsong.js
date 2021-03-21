module.exports = function () {
  bot.on("endsong", function (data) {
    if (config.verboseLogging) {
      console.log("[SONG END]", JSON.stringify(data, null, 2));
    } else if (data.userid && data.name) {
      console.log("[SONG END]", data.name + ": " + data.text);
    }

    // Save the last song's data to the DB
    // saveLastSong(data.lastPlay);

    // the history endpoint from plug doesn't have the last song played, so we will need to get it another way
    //bot.lastPlay = data.lastPlay;
    //bot.mediaHistory = bot.getHistory();
  });
};
