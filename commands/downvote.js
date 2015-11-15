exports.names = ['downvote'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1) {

        var message = "";
        var input = _.rest(data.message.split(' '), 1).join(' ').trim();
        if (input.length > 1) {
            message = input + ' ';
        }

        message += config.responses.downvoteReminder;
        bot.sendChat(message);
    }
};