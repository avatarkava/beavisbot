module.exports = function () {
  bot.on("snagged", function (data) {
    if (config.verboseLogging) {
      console.log("[SNAG] " + JSON.stringify(data, null, 2));
    } else if (data) {
      console.log("[SNAG]", data.name + " grabbed this song");
    }
  });
};
