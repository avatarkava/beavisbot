exports.names = ['move', 'mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (bot.hasPermission(bot.getUser(data.user.id), 'queue-order')) {

        var input = data.message.split(' ');
        if (input.length >= 3) {
            var username = _.rest(input, 1);
            username = _.initial(username, 1).join(' ').trim();
            var usernameFormatted = S(username).chompLeft('@').s;
            var position = parseInt(_.last(input, 1)) - 1;
            users = bot.getUsers();
            var user = _.findWhere(users, {username: usernameFormatted});
            if (user !== undefined) {
                var currentPosition = bot.getQueuePosition(user.id);
                if (currentPosition === -1) {
                    bot.sendChat('/me ' + username + ' does not have any songs queued.');
                }
                else if (currentPosition > 0 && currentPosition !== position - 1) {
                    bot.moderateMoveDJ(user.id, position - 1);
                }
                console.log('Moving ' + usernameFormatted + ' to position: ' + position);
            }
        }
    }
}
