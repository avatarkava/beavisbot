exports.names = ['kick'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.BOUNCER;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    var username;
    var message;

    if (params.length >= 2) {
        username = _.initial(params).join(' ').trim();
        message = _.last(params).toUpperCase();
    }
    else if (params.length == 1) {
        username = params.join(' ').trim();
        message = '';
    }

    var usernameFormatted = S(username).chompLeft('@').s;
    var user = bot.getUserByName(usernameFormatted, true);

    if (user) {
        bot.moderateKickUser(user.id, message);

        getDbUserFromSiteUser(user.id, function (row) {
            var userData = {
                type: 'kick',
                details: 'Kicked ' + username,
                user_id: row.id,
                mod_user_id: data.from.db.id
            };
            models.Karma.create(userData);
            console.log('[KICK] ' + username + ' kicked from room');
            models.User.update({queue_position: -1}, {where: {site_id: user.id}});
        });

    }
    else {
        bot.sendChat('/me ' + usernameFormatted + ' not found in the room');
    }

};

