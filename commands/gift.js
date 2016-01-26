exports.names = ['gift'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var username = input[1];
    var usernameFormatted = S(username).chompLeft('@').s;
    var amount = parseInt(input[2]);
    var user = bot.getUserByName(usernameFormatted);

    if (!amount || isNaN(amount) || amount < 1) {
        amount = 1;
    }

    if (!username) {
        bot.sendChat('/me usage: .gift @username 50 (gifts 50 points)');
        return;
    }
    else if (!user) {
        bot.sendChat('/me user ' + username + ' was not found.');
    }

    getDbUserFromSiteUser(data.user, function (row) {
        if (!row || row.custom_points == 0) {
            bot.sendChat('You do not have any ' + config.customPointName + ' to give, @' + data.user.username + '.');
            return;
        } else if (row.custom_points < amount) {
            bot.sendChat('You only have ' + row.custom_points + ' ' +  config.customPointName + ' to give, @' +
                data.user.username + '.');
            return;
        }

        transferCustomPoints(data.user, user, amount);

    });
};