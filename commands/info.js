exports.names = ['info', 'userinfo']
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

    models.User.find({where: {username: username}}).then(function (row) {
        if (row === null) {
            bot.sendChat(username + ' was not found.');
        } else {
            // @TODO - store & display data we can get from the site like 'active', 'playedCount', 'songsInQueue', 'dubs'
            message = username + ' • ' + row.locale + ' • seen ' + timeSince(row.last_seen) + ' • joined ' + moment.utc(row.joined).calendar() + ' • ID: ' + row.site_id;

            if (config.customPointName) {
                message = message + ' • ' + config.customPointName + row.custom_points.toLocaleString();
            }
            bot.sendChat(message);
        }
    });

};