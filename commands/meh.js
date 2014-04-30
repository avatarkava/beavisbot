exports.names = ['.meh'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat(config.responses.mehReminder);
};