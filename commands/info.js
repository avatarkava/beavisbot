exports.names = ['.info', '.userinfo']
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    var message = '';

    if (params.length < 1) {
        username = data.from.username;
    }
    else {
        usernameRaw = params.join(' ').trim();
        username = S(usernameRaw).chompLeft('@').s;
    }

    User.find({where: {username: username}}).on('success', function (row) {
        if (row === null) {
            bot.sendChat(username + ' was not found.');
        } else {
            joined = timeSince(row.joined);
            birthday = row.birthday;
            level = row.level;
            slug = row.slug;

            message = username + ' - Level ' + level + ' - Joined ' + joined;
            if (level > 4) {
                message += ' - https://plug.dj/@/' + slug;
            }
            bot.sendChat(message);
        }
    });

};