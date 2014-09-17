exports.names = ['.move', '.mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (data.from.role > 1) {
        bot.moderateDeleteChat(data.id);
        var input = data.message.split(' ');
        if (input.length >= 3) {
            var username = _.rest(input, 1);
            username = _.initial(username, 1).join(' ').trim();
            var position = parseInt(_.last(input, 1));
            users = bot.getUsers();
            var user = _.findWhere(users, {username: username.substring(1)});
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
                logger.info('Moving ' + username + ' to position: ' + position);
            }
        }
    }
}
