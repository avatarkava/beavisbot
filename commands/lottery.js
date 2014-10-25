exports.names = ['.lottery'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var mins = 1;

    if (data.from.role > 1 && config.activeDJTimeoutMins > 0) {

        if (input.length >= 2) {
            mins = parseInt(_.last(input, 1));
        }
        else {
            mins = 5;
        }

        bot.sendChat('Wait list lottery in ' + mins + ' minutes!  Join the line and chat within ' + mins + ' minutes to enter!');

        setTimeout(function () {
            // Only select from users active during the lottery
            getActiveDJs(mins, 2, function (activeDJs) {
                var randomNumber = _.random(1, activeDJs.length);
                var winner = activeDJs[(randomNumber - 1)]
                bot.sendChat(":tada: @" + winner + " emerges victorious!");
                position = 2;
                users = bot.getUsers();
                var user = _.findWhere(users, {username: winner});
                if (user !== undefined) {
                    var currentPosition = bot.getWaitListPosition(user.id);
                    if (currentPosition > 2 && currentPosition > position) {
                        bot.moderateMoveDJ(user.id, position);
                        logger.info('[LOTTO] Moving ' + winner + ' to position: ' + position);
                    }
                }
            });
        }, mins * 60 * 1000);
    }
};