exports.names = ['.rules'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    //bot.moderateDeleteChat(data.id);
    var message = "";
    var input = _.rest(data.message.split(' '), 1).join(' ').trim();
    if (input.length > 1) {
        message = input + ' ';
    }

    message += config.responses.rules;
    bot.sendChat(message);
};