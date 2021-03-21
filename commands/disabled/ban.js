exports.names = ['ban', 'unban'];
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
        bot.sendChat('Usage: .[ban|unban|kick] username [PERMA|DAY|HOUR]');
        return;
    }

    var usernameFormatted = S(username).chompLeft('@').s;

    switch (duration) {
        case 'DAY':
            apiDuration = PlugAPI.BAN.DAY;
            break;
        case 'PERMA':
            apiDuration = PlugAPI.BAN.PERMA;
            break;
        case 'HOUR':
        default:
            apiDuration = PlugAPI.BAN.HOUR;
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
                    console.log('[BAN] ' + data.from.username + ' attempting to ban ' + usernameFormatted + ' for ' + duration + ' (' + apiDuration + ')');
                    bot.moderateBanUser(row.site_id, PlugAPI.BAN_REASON.OFFENSIVE_MEDIA, apiDuration);
                    break;
                case 'unban':
                    bot.moderateUnbanUser(row.site_id, function () {
                        bot.sendChat('unbanning ' + usernameFormatted + '. This can take a few moments...');
                    });
                    break;
            }
        }
    });


};