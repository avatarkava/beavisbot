module.exports = function () {
  bot.on("tcpConnect", function (socket, msg) {
    console.log("[EVENT] tcpConnect");
    console.log(socket);
    console.log(msg);
  });
};
