exports.names = ['.info', '.userinfo']
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    var message = '';

    if (params.length < 1) {
        username = data.from.username;
        joined = timeSince(data.from.joined);
        level = data.from.level;
    }
    else {

        usernameRaw = params.join(' ').trim()
        username = S(usernameRaw).chompLeft('@').s;

        User.find({where: {username: username}}).on('success', function (row) {
            if (row === null) {
                bot.sendChat(username + ' was not found.');
                return;
            } else {
                joined = timeSince(row.joined);
                birthday = row.birthday;
                level = row.level;
            }
        });
    }

    message = username + ' - Level ' + level + ': joined ' + joined;
    if (level > 4) {
        message += ' - https://plug.dj/@/' + S(username).slugify().s;
    }
    bot.sendChat(message);
};