exports.names = ['mute', 'unmute'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {

    var input = data.message.split(' ');

    var command = _.first(input);
    var username = _.rest(input, 1);
    var usernameFormatted = S(username).chompLeft('@').s;
    var message = '';

    var user = findUserInList(bot.getUsers(), usernameFormatted);
    if (user !== undefined) {
        if (command == 'unmute') {
            bot.moderateUnmuteUser(user.id);
            message = '[UNMUTE] ' + data.from.username + ' unmuted ' + usernameFormatted;
            console.log(message);
            sendToSlack(message);
            bot.sendChat('/me ' + usernameFormatted + ' is now unmuted.');
        } else {
            // @TODO - Make this variable
            var mute_duration = PlugAPI.MUTE.LONG;
            bot.moderateMuteUser(user.id, 1, mute_duration);
        }
    }

};

