module.exports = function (bot) {
    bot.on('tcpConnect', function (socket) {
        console.log('[TCP] Connected!');
    });
};
