exports.names = ['add'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {
    var input = data.message.split(' ');
    var username = _.rest(input, 1).join(' ').trim();
    var usernameFormatted = S(username).chompLeft('@').s;
    if (usernameFormatted) {
        var user = findUserInList(bot.getUsers(), usernameFormatted);
        if (user && bot.getWaitListPosition(user.id) === -1) {
            bot.moderateAddDJ(user.id, function () {
                console.log('[ADD] ' + data.from.username + ' added ' + user.username + ' to waitlist.');
            });
        }
    }
};
