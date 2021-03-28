exports.names = ['whois', 'info', 'userinfo'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var params = _.rest(data.text.split(' '), 1);
    var message = '';

    if (params.length < 1) {
        username = data.name;
    }
    else {
        usernameRaw = params.join(' ').trim();
        username = S.ltrim(usernameRaw, '@');                
    }

    models.User.findOne({where: {username: username }, order: [['updatedAt', 'DESC']]}).then(function (row) {
        if (row === null) {
            bot.speak(username + ' was not found.');
        } else {
            // @TODO - store & display data we can get from the site like 'active', 'playedCount', 'songsInQueue', 'dubs'
            message = row.username;
            /*
            if (row.locale !== null && row.locale != 'null') {
                message += ' • ' + row.locale;

            }
            */
            message += ' • seen ' + timeSince(row.last_seen) + ' • joined ' + moment.utc(row.joined).calendar()
                + ' • ID: ' + row.site_id + ' • Pts: ' + row.site_points;

            if (config.customPointName) {
                message = message + ' • ' + config.customPointName + ' ' + row.custom_points.toLocaleString();
            }
            bot.speak(message);
        }
    });

};