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
    var duration = 'PERMA';
    var message = '';

    // if (params.length >= 2) {
    //     username = _.initial(params).join(' ').trim();
    //     duration = _.last(params).toUpperCase();
    // }
    if (params.length >= 1) {
        username = params.join(' ').trim();
    } else {
        bot.sendChat('Usage: .[wlban|wlunban] username [15|30|45|PERMA]');
        return;
    }

    var usernameFormatted = S(username).chompLeft('@').s;

    // Don't let bouncers get too feisty (API should prohibit this, but just making sure!
    // if (!settings.bouncerplus && data.from.role < 3) {
    //     duration = 'HOUR';
    // }

    switch (duration) {
        case 'SHORT':
            apiDuration = bot.WLBAN.SHORT;
            break;
        case 'MEDIUM':
            apiDuration = bot.WLBAN.MEDIUM;
            break;
        case 'PERMA':
            apiDuration = bot.WLBAN.PERMA;
            break;
        case 'LONG':
        default:
            apiDuration = bot.WLBAN.LONG;
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
                case 'ban':
                    console.log('[WLBAN] ' + usernameFormatted + ' attempting waitlist ban for ' + duration + ' (' + apiDuration + ') by ' + data.from.username);
                    bot.moderateWaitListBan(row.site_id, bot.WLBAN_REASON.INAPPROPRIATE_GENRE, apiDuration);
                    break;
                case 'unban':
                    bot.moderateWaitListUnbanUser(row.site_id, function () {
                        bot.sendChat('unbanning ' + usernameFormatted + '. This can take a few moments...');
                    });
                    break;
            }
        }
    });


};