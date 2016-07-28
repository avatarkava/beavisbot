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

    users = bot.getUsers();
    var user = findUserInList(users, usernameFormatted);
    if (user !== undefined) {
        if (command == 'unmute') {
            bot.moderateUnmuteUser(user.id);
        } else {
            bot.moderateMuteUser(user.id, 1, mute_duration, PlugAPI.MUTE.LONG);
        }
        console.log('Muting ' + usernameFormatted);
    }

};

