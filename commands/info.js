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
            // @TODO - store & display data we can get from dub like 'active', 'playedCount', 'songsInQueue', 'dubs'
            message = username + ' • ' + row.locale + ' • seen ' + timeSince(row.last_seen) + ' • '
                + row.site_points.toLocaleString() + ' dubs • joined ' + moment.utc(row.joined).calendar() + ' • ID: ' + row.site_id;
            bot.sendChat(message);
        }
    });

};