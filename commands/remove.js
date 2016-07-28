exports.names = ['remove', 'rm', 'rmafk', 'rmidle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 15;
exports.cdUser = 15;
exports.cdManager = 0;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {
    var command = _.first(data.message.split(' '))
    var params = _.rest(data.message.split(' '), 1);
    var username = params.join(' ').trim()
    var usernameFormatted = S(username).chompLeft('@').s;
    var user = findUserInList(bot.getUsers(), usernameFormatted);
    if (user) {
        if (user.songsInQueue == 0) {
            bot.sendChat('/me ' + user.username + ' does not have any songs queued');
            return;
        }
        bot.moderateRemoveDJ(user.id);
        if (command === 'rmafk' || command === 'rmidle') {
            bot.sendChat('@' + user.username + ' ' + config.responses.activeDJRemoveMessage);
        }

        getDbUserFromSiteUser(user, function (row) {
            var userData = {
                type: 'remove',
                details: 'Paused queue for ' + data.username,
                user_id: row.id,
                mod_user_id: data.from.db.id
            };
            models.Karma.create(userData);
            console.log('[REMOVE] ' + data.from.username + ' paused the queue for ' + user.username);
            models.User.update({queue_position: -1}, {where: {site_id: user.id}});
        });

    }
    else {
        bot.sendChat('/me ' + usernameFormatted + ' not found in the room');
    }
    
};
