exports.names = ['removesong', 'rmsong'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = true;
exports.handler = function (data) {
    if (bot.hasPermission(bot.getUser(data.from.id), 'queue-order')) {
        var command = _.first(data.message.split(' '))
        var params = _.rest(data.message.split(' '), 1);
        var username = params.join(' ').trim()
        var usernameFormatted = S(username).chompLeft('@').s;
        var user = bot.getUserByName(usernameFormatted, true);
        if (user) {
            console.log(user);
            if (user.songsInQueue == 0) {
                bot.sendChat('/me ' + user.username + ' does not have any songs queued');
                return;
            }
            bot.moderateRemoveSong(user.id);

            getDbUserFromSiteUser(user, function (row) {
                var userData = {
                    type: 'remove',
                    details: 'Removed queued song by ' + data.from.username,
                    user_id: row.id,
                    mod_user_id: data.from.db.id
                };
                models.Karma.create(userData);
                console.log('[REMOVE] ' + data.from.username + ' removed a song queued by  ' + user.username);
            });

        }
        else {
            bot.sendChat('/me ' + usernameFormatted + ' not found in the room');
        }
    }
};
