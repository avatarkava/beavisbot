module.exports = function () {
  bot.on("disconnected", function (error) {
    console.log("[EVENT] Error: " + error);
  });
};
