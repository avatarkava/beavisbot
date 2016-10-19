exports.names = ['rules'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var message = '';
    var input = _.rest(data.message.split(' '), 1).join(' ').trim();
    if (input.length > 1) {
        message = input + ' ';
    }

    message += config.responses.rules;
    bot.sendChat('/me ' + message);
};