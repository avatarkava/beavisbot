exports.names = ['.freespin'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat(config.responses.freeSpin);
};