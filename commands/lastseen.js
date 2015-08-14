exports.names = ['.lastseen', '.seen'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    if (params.length < 1) {
        bot.sendChat('/me usage: .lastseen username');
        return;
    }

    username = params.join(' ').trim()
    usernameFormatted = S(username).chompLeft('@').s;

    User.find({where: {username: usernameFormatted}}).then(function (row) {
        if (row === null) {
            bot.sendChat(usernameFormatted + ' was not found.');
        } else {
            user = _.findWhere(bot.getUsers(), {username: usernameFormatted});
            if (user) {
                bot.sendChat(usernameFormatted + ' is in the room and was last active ' + timeSince(row.last_active));
            }
            else {
                bot.sendChat(row.username + ' was last seen ' + timeSince(row.last_seen));
            }
        }
    });

};