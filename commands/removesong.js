exports.names = ['removesong', 'rmsong'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (bot.hasPermission(bot.getUser(data.user.id), 'queue-order')) {
        var command = _.first(data.message.split(' '))
        var params = _.rest(data.message.split(' '), 1);
        var username = params.join(' ').trim()
        var usernameFormatted = S(username).chompLeft('@').s;
        var user = bot.getUserByName(usernameFormatted, true);
        if (user) {
            console.log(user);
            if (user.songsInQueue == 0) {
                bot.sendChat('/me ' + usernameFormatted + ' does not have any songs queued');
                return;
            }
            bot.moderateRemoveSong(user.id);

            getDbUserFromSiteUser(user, function (row) {
                var userData = {
                    type: 'remove',
                    details: 'Removed queued song by ' + data.user.username,
                    user_id: row.id,
                    mod_user_id: data.user.db.id
                };
                models.Karma.create(userData);
                console.log('[REMOVE] ' + data.user.username + ' removed a song queued by  ' + usernameFormatted);
            });

        }
        else {
            bot.sendChat('/me ' + usernameFormatted + ' not found in the room');
        }
    }
};
