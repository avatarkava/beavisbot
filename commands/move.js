exports.names = ['move', 'mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdManager = 30;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {
    //bot.moderateDeleteChat(data.id);
    var input = data.message.split(' ');
    if (input.length >= 3) {
        var username = _.rest(input, 1);
        username = _.initial(username, 1).join(' ').trim();
        var usernameFormatted = S(username).chompLeft('@').s;
        var position = parseInt(_.last(input, 1));
        users = bot.getUsers();
        var user = findUserInList(users, usernameFormatted);
        if (user !== undefined) {
            var currentPosition = bot.getWaitListPosition(user.id);
            if (currentPosition === -1) {
                bot.moderateAddDJ(user.id, function () {
                    if (position <= bot.getWaitList().length) {
                        bot.moderateMoveDJ(user.id, position);
                    }
                });
            }
            else if (currentPosition > 0 && currentPosition !== position) {
                bot.moderateMoveDJ(user.id, position);
            }
            console.log('Moving ' + usernameFormatted + ' to position: ' + position);
        }
    }

}