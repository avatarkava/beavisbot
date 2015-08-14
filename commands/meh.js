exports.names = ['.meh'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1) {
        //bot.moderateDeleteChat(data.id);
        var message = "";
        var input = _.rest(data.message.split(' '), 1).join(' ').trim();
        if (input.length > 1) {
            message = input + ' ';
        }

        message += config.responses.mehReminder;
        bot.sendChat(message);
    }
};