exports.names = ['info', 'userinfo']
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    var message = '';

    if (params.length < 1) {
        username = data.user.username;
    }
    else {
        usernameRaw = params.join(' ').trim();
        username = S(usernameRaw).chompLeft('@').s;
    }

    models.User.find({where: {username: username}}).then(function (row) {
        if (row === null) {
            bot.sendChat(username + ' was not found.');
        } else {
            joined = timeSince(row.joined);
            birthday = row.birthday;
            slug = row.slug;
            id = row.id

            // @TODO - display data we can get from dub like 'active', 'playedCount', 'songsInQueue', 'dubs'

            message = username + ' (' + id + ') - Joined ' + joined + ' - https://www.dubtrack.fm/' + slug;
            bot.sendChat(message);
        }
    });

};