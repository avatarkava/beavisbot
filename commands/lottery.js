exports.names = ['.lottery', '.roulette'];
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

        // Sanity check!
        if (mins < 1) {
            mins = 1;
        }

        if (input[0] === '.roulette') {
            bot.sendChat('Wait list roulette in ' + mins + ' minutes! Join the line and chat within ' + mins + ' minutes to enter.  Winner gets moved up a random number of spots! @djs');
        }
        else {
            bot.sendChat('Wait list lottery in ' + mins + ' minutes! Join the line and chat within ' + mins + ' minutes to enter.  Winner gets the #1 spot! @djs');
        }

        setTimeout(function () {
            bot.sendChat("@djs contest ending in ONE MINUTE - join the line and chat to enter!");
        }, (mins - 1) * 60 * 1000);

        setTimeout(function () {
            // Only select from users active during the lottery
            getActiveDJs(mins, 1, function (activeDJs) {
                var randomNumber = _.random(1, activeDJs.length);
                var winner = activeDJs[(randomNumber - 1)]
                bot.sendChat(":tada: @" + winner + " emerges victorious!");
                users = bot.getUsers();
                var user = _.findWhere(users, {username: winner});
                if (user !== undefined) {
                    var currentPosition = bot.getWaitListPosition(user.id);
                    if (input[0] === '.roulette') {
                        position = _.random(1, currentPosition - 1);
                    } else {
                        position = 1;
                    }
                    if (currentPosition > 1 && currentPosition > position) {
                        bot.moderateMoveDJ(user.id, position);
                        logger.info('[LOTTO] Moving ' + winner + ' to position: ' + position);
                    }
                }
            });
        }, mins * 60 * 1000);
    }
};