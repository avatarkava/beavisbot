module.exports = function (bot) {
    bot.on('disconnected', function (data) {
        bot.reconnect();
    });
}
