exports.names = ['gift'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var params = _.rest(input, 1);
    var username = _.initial(params);
    var amount = parseInt(_.last(params));

    if (!amount || isNaN(amount) || amount < 1 || !username) {
        bot.sendChat('/me usage: .gift @username 50 (gifts 50 points)');
        return;
    }

    var usernameFormatted = S(username).chompLeft('@').s;
    var user = findUserInList(bot.getUsers(), usernameFormatted);

    if (!user) {
        bot.sendChat('/me user ' + username + ' was not found.');
    }

    getDbUserFromSiteUser(data.from, function (row) {
        if (!row || row.custom_points == 0) {
            bot.sendChat('You do not have any ' + config.customPointName + ' to give, @' + data.from.username + '.');
            return;
        } else if (row.custom_points < amount) {
            bot.sendChat('You only have ' + row.custom_points + ' ' + config.customPointName + ' to give, @' +
                data.from.username + '.');
            return;
        }

        transferCustomPoints(data.from, user, amount);

    });
};