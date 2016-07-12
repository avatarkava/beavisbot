exports.names = ['lastseen', 'seen'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    if (params.length < 1) {
        bot.sendChat('/me usage: ' + config.commandLiteral + 'lastseen username');
        return;
    }

    username = params.join(' ').trim()
    usernameFormatted = S(username).chompLeft('@').s;

    models.User.find({where: {username: usernameFormatted, site: config.site}}).then(function (row) {
        if (row === null) {
            bot.sendChat(usernameFormatted + ' was not found.');
        } else {
            var user = findUserInList(bot.getUsers(), usernameFormatted);
            if (user) {
                bot.sendChat(JSON.stringify(user, null, 2));
                bot.sendChat('/me' + user.username + ' is in the room and was last active ' + timeSince(row.last_active));
            }
            else {
                bot.sendChat('/me' + row.username + ' was last seen ' + timeSince(row.last_seen));
            }
        }
    });

};