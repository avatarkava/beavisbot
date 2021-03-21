module.exports = function () {
  bot.on("error", function (error) {
    console.log("[EVENT] Error: " + error);
  });
};
