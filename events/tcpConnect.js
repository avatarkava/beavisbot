module.exports = function () {
  bot.on("tcpConnect", function (socket) {
    console.log("[EVENT] tcpConnect: " + socket);
  });
};
