module.exports = function () {
  bot.on("pmmed", function (data) {
    if (config.verboseLogging) {
      console.log("[PM]", JSON.stringify(data, null, 2));
    } else if (data.userid && data.name) {
      console.log("[PM]", data.name + ": " + data.text);
    }    
  });
};
