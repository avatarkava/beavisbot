exports.names = ['.lottery'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    //users = bot.getUsers();
    //var randomNumber = _.random(1, users.length);
    //bot.sendChat(":bell: Now serving customer #" + randomNumber + " - hey there, " + users[(randomNumber - 1)].username + "!");

    var input = data.message.split(' ');
    var mins = 1;

    if (data.from.role > 1 && config.activeDJTimeoutMins > 0) {

        if (input.length >= 2) {
            mins = parseInt(_.last(input, 1));
        }
        else {
            mins = 1;
        }

        bot.sendChat('Lottery starting in ' + mins + ' minutes!  Chat any time in the next ' + mins + ' to enter!');

        setTimeout(function () {
            // Only select from users active during the lottery
            var activeUsers = getActiveUsers(mins, function () {
                var randomNumber = _.random(1, activeUsers.length);
                var winner = activeUsers[(randomNumber - 1)]
                bot.sendChat(":tada: " + winner + " emerges victorious!");
                position = 2;
                users = bot.getUsers();
                var user = _.findWhere(users, {username: winner});
                if (user !== undefined) {
                    var currentPosition = bot.getWaitListPosition(user.id);
                    if (currentPosition === -1) {
                        bot.moderateAddDJ(user.id, function () {
                            if (position <= bot.getWaitList().length) {
                                bot.moderateMoveDJ(user.id, position);
                            }
                        });
                    }
                    else if (currentPosition > 0 && currentPosition > position) {
                        bot.moderateMoveDJ(user.id, position);
                    }
                    logger.info('[LOTTO] Moving ' + winner + ' to position: ' + position);
                }
            });
        }, mins * 60 * 1000);
    }
};