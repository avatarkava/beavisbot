module.exports = function () {
  bot.on("snagged", function (data) {
    if (config.verboseLogging) {
      console.log("[SNAG] " + JSON.stringify(data, null, 2));
    } else if (data) {

      roomState.snags++;
      getDbUserFromUserId(data.userid, function (user) {
        console.log("[SNAG]", user.username + " grabbed this song");
      });
    }
  });
};
