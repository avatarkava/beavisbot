module.exports = function () {
  bot.on("nosong", function (data) {
    if (config.verboseLogging) {
      console.log("[SONG]", JSON.stringify(data, null, 2));
    } else if (data.userid && data.name) {
      console.log("[SONG]", data.name + ": " + data.text);
    }    
  });
};
