exports.names = ['.remove', '.rm', '.rmafk', '.rmidle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (data.from.role > 1) {
        bot.moderateDeleteChat(data.id);
        var input = data.message.split(' ');
        var username = _.rest(input, 1).join(' ').trim();
        if (username) {
            user = _.findWhere(bot.getUsers(), {username: username.substring(1)});
            if (user && bot.getWaitListPosition(user.id) !== -1) {
                bot.moderateRemoveDJ(user.id);
                if (input[0] === '.rmafk' || input[0] === '.rmidle') {
                    bot.sendChat(username + ' ' + config.responses.activeDJRemoveMessage);
                }
            }
            //db.run('UPDATE DISCIPLINE SET warns = 0, removes = removes + 1, lastAction = CURRENT_TIMESTAMP WHERE userid = ?', [row.userid]);
            logger.warning('[REMOVE] ' + data.from.username + ' removed ' + username + ' from wait list');
        }
    }
};
