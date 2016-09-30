exports.names = ['remove', 'rm', 'rmafk', 'rmidle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
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
                details: 'Removed ' + data.username + ' from the wait list',
                user_id: row.id,
                mod_user_id: data.from.db.id
            };
            models.Karma.create(userData);
            var message = '[REMOVE] ' + data.from.username + ' removed ' + user.username + ' from the wait list';
            console.log(message);
            sendToSlack('@channel - ' + message);
            models.User.update({queue_position: -1}, {where: {id: row.id}});
        });

    }
    else {
        bot.sendChat('/me ' + usernameFormatted + ' not found in the room');
    }

};
