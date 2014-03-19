exports.names = ['.woot'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (room.staff[data.fromID] > 1) {

        var message = "";
        var input = smartSplit(data.message, ' ', 1);
        if (input.length > 1) {
            message = input[1] + ' ';
        }

        message += config.responses.wootReminder;
        bot.chat(message);
    }
};