exports.names = ['.rules'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var message = "";
    var input = smartSplit(data.message, ' ', 1);
    if (input.length > 1) {
        message = input[1] + ' ';
    }

    message += config.responses.rules;
    bot.chat(message);
};