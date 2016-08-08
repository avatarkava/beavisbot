exports.names = ['ban', 'unban'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.BOUNCER;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input);
    var username = '';

    if (params.length >= 2) {
        username = _.initial(params).join(' ').trim();
        duration = _.last(params).toUpperCase();
    }
    else if (params.length == 1) {
        username = params.join(' ').trim();
        var duration = 'PERMA';
    }
    else {
        bot.sendChat('Usage: .[ban|unban|kick] username [PERMA|DAY|HOUR]');
        return;
    }

    var usernameFormatted = S(username).chompLeft('@').s;

    // Don't let bouncers get too feisty (API should prohibit this, but just making sure!
    if (!settings.bouncerplus && data.from.role == 2) {
        duration = 'HOUR';
    }

    switch (duration) {
        case 'DAY':
            apiDuration = 1440;
            break;
        case 'PERMA':
            apiDuration = -1;
            break;
        case 'HOUR':
        default:
            apiDuration = 60;
            break;

    }

    models.User.find({where: {username: usernameFormatted, site: config.site}}).then(function (row) {
        if (row === null) {
            bot.sendChat('/me ' + usernameFormatted + ' was not found.');
        } else {
            switch (command) {
                case '.ban':
                    bot.moderateBanUser(row.site_id, 0, apiDuration, function () {
                        console.log('[BAN] ' + usernameFormatted + ' was banned for ' + duration + ' by ' + data.from.username);
                    }
                    break;
                case '.unban':
                    bot.moderateUnbanUser(row.site_id, function () {
                        bot.sendChat('/me unbanning ' + usernameFormatted + '. This can take a few moments...');
                        console.log('[UNBAN] ' + usernameFormatted + ' was unbanned by ' + data.from.username);
                    }
                    break;
            }
        }
    });

    // @TODO - Add Karmas

    //db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
    //    if (row) {
    //        switch (command) {
    //            case '.ban':
    //                bot.moderateBanUser(row.id, 0, apiDuration, function () {
    //                    logger.warning('[BAN] ' + username + ' was banned for ' + duration + ' by ' + data.from.username);
    //                    var userData = {
    //                        type: 'ban',
    //                        details: 'Banned for ' + duration + ' by ' + data.from.username,
    //                        user_id: row.id,
    //                        mod_user_id: data.from.id
    //                    };
    //                    Karma.create(userData);
    //                });
    //                break;
    //            case '.unban':
    //                bot.moderateUnbanUser(row.userid, function () {
    //                    bot.sendChat('/me unbanning ' + username + '. This can take a few moments...');
    //                    logger.info('[UNBAN] ' + username + ' was unbanned by ' + data.from.username);
    //                    var userData = {
    //                        type: 'unban',
    //                        details: 'Unbanned by ' + data.from.username,
    //                        user_id: row.id,
    //                        mod_user_id: data.from.id
    //                    };
    //                    Karma.create(userData);
    //                });
    //                break;
    //            default:
    //                logger.error('Invalid command called: ' + command);
    //                break;
    //        }
    //    }
    //});

};
