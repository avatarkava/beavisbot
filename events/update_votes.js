module.exports = function () {
  bot.on("update_votes", function (data) {
    if (config.verboseLogging) {
      console.log("[VOTE]", JSON.stringify(data, null, 2));
    } else if (data.userid && data.name) {
      console.log("[VOTE]", data.name + ": " + data.text);
    }    
  });
};
