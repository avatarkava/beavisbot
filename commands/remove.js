exports.names = ['.remove', '.rm', '.rmafk', '.rmidle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (data.from.role > 1) {
        //bot.moderateDeleteChat(data.id);
        var input = data.message.split(' ');
        var username = _.rest(input, 1).join(' ').trim();
        var usernameFormatted = S(username).chompLeft('@').s;
        if (username) {
            user = _.findWhere(bot.getUsers(), {username: usernameFormatted});
            var position = bot.getWaitListPosition(user.id)
            if (user && position !== -1) {
                bot.moderateRemoveDJ(user.id);
                if (input[0] === '.rmafk' || input[0] === '.rmidle') {
                    bot.sendChat('@' + usernameFormatted + ' ' + config.responses.activeDJRemoveMessage);
                }
            }
            var userData = {
                type: 'remove',
                details: 'Removed from position ' + position + ' by ' + data.from.username,
                user_id: user.id,
                mod_user_id: data.from.id
            };
            Karma.create(userData);
            logger.warning('[REMOVE] ' + data.from.username + ' removed ' + usernameFormatted + ' from wait list');
            User.update({waitlist_position: -1}, {where: {id: user.id}});
        }
    }
};
