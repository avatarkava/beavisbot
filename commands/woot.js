exports.names = ['.woot'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (room.staff[data.fromID] > 0) {
        bot.chat(config.responses.wootReminder);
    }
};