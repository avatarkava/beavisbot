module.exports = function () {
  bot.on("snagged", function (data) {
    if (config.verboseLogging) {
      console.log("[GRAB] " + JSON.stringify(data, null, 2));
    } else if (user) {
      console.log("[GRAB]", data.name + " grabbed this song");
    }
  });
};
