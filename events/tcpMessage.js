module.exports = function (bot) {
    bot.on('tcpMessage', function (socket, msg) {
        if (typeof msg !== "undefined" && msg.length > 2) {
            console.log('[TCP] ' + msg);
            // Convert into same format as incoming chat messages through the UI
            var data = {
                message: msg,
                from: bot.getUser()
            };

            if (data.message.indexOf('.') === 0) {
                handleCommand(data);
            }
            else {
                bot.sendChat(msg);
            }
        }
    });
};
