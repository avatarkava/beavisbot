// Instructs the bot to woot a song. Only available for bouncers and higher.
exports.names = ['.w'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1) {
        bot.woot();
    }
};