module.exports = function () {
  bot.on("tcpEnd", function (socket) {
    console.log("[EVENT] tcpEnd: " + socket);
  });
};
