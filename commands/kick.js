exports.names = ['kick'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (bot.hasPermission(bot.getUser(data.user.id), 'queue-order')) {

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
        var user = bot.getUserByName(usernameFormatted.toLowerCase());

        if (user) {
            bot.moderateKickUser(user.id, message);

            getDbUserFromSiteUser(user.id, function (row) {
                var userData = {
                    type: 'kick',
                    details: 'Kicked ' + data.user.username,
                    user_id: row.id,
                    mod_user_id: data.user.db.id
                };
                models.Karma.create(userData);
                console.log('[KICK] ' + data.user.username + ' kicked from room');
                models.User.update({queue_position: -1}, {where: {site_id: user.id}});
            });

        }
        else {
            bot.sendChat('/me ' + usernameFormatted + ' not found in the room');
        }
    }
};

