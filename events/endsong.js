module.exports = function () {
  bot.on("endsong", function (data) {
    if (config.verboseLogging) {
      console.log("[SONG END]", JSON.stringify(data, null, 2));
    } else if (data.userid && data.name) {
      console.log("[SONG END]", data.name + ": " + data.text);
    }    
  });
};
