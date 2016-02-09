exports.names = ['add'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = true;
exports.handler = function (data) {
    // @TODO - No functionality for this in dubtrack
    /*
    if (data.from.role > 1) {
        //bot.moderateDeleteChat(data.id);
        var input = data.message.split(' ');
        var username = _.rest(input, 1).join(' ').trim();
        var usernameFormatted = S(username).chompLeft('@').s;
        if (usernameFormatted) {
            var user = bot.getUserByName(usernameFormatted, true);
            if (user && bot.getQueuePosition(user.id) === -1) {
                bot.moderateAddDJ(user.id, function () {
                    logger.info('[ADD] ' + data.from.username + ' added ' + user.username + ' to waitlist.');
                });
            }
        }
    }
    */
};
