exports.names = ['wlban', 'wlunban'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.BOUNCER;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input);
    var username = '';
    var duration = 'HOUR';
    var message = '';

    if (params.length >= 2) {
        username = _.initial(params).join(' ').trim();
        duration = _.last(params).toUpperCase();
    } else if (params.length >= 1) {
        username = params.join(' ').trim();
    } else {
        bot.sendChat('Usage: .[wlban|wlunban] username [15|HOUR|DAY|PERMA]');
        return;
    }

    var usernameFormatted = S(username).chompLeft('@').s;

    switch (duration) {
        case '15':
            apiDuration = bot.WLBAN.SHORT;
            break;
        case 'DAY':
            apiDuration = bot.WLBAN.LONG;
            break;
        case 'PERMA':
            apiDuration = bot.WLBAN.PERMA;
            break;
        case 'HOUR':
        default:
            apiDuration = bot.WLBAN.MEDIUM;
            break;
    }

    models.User.find({
        where: {
            username: usernameFormatted,
            site: config.site
        },
        order: 'id DESC'
    }).then(function (row) {
        if (row === null) {
            bot.sendChat(usernameFormatted + ' was not found.');
        } else {
            switch (command) {
                case 'wlban':
                    console.log('[WLBAN] ' + data.from.username + ' attempting to ban ' + usernameFormatted + ' for ' + duration + ' (' + apiDuration + ')');
                    bot.moderateWaitListBan(row.site_id, bot.WLBAN_REASON.INAPPROPRIATE_GENRE, apiDuration);
                    break;
                case 'wlunban':
                    bot.moderateWaitListUnbanUser(row.site_id, function () {
                        bot.sendChat('unbanning ' + usernameFormatted + '. This can take a few moments...');
                    });
                    break;
            }
        }
    });
};