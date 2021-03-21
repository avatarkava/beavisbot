module.exports = function () {
  bot.on("newsong", function (data) {
    if (config.verboseLogging) {
      console.log("[SONG START]", JSON.stringify(data, null, 2));
    } else if (data.userid && data.name) {
      console.log("[SONG START]", data.name + ": " + data.text);
    }    
  });
};
