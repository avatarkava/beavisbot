exports.names = ['.add'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (data.from.role > 1) {
        bot.moderateDeleteChat(data.id);
        var input = data.message.split(' ');
        var username = _.rest(input, 1).join(' ').trim();
        if (username) {
            user = _.findWhere(bot.getUsers(), {username: username.substring(1)});
            if (user) {
                bot.moderateAddDJ(user.id, function() {
                    logger.info('[ADD] ' + data.from.username + ' added ' + username + ' to waitlist.');
                });
            }
        }
    }
};
