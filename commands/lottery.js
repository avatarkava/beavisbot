exports.names = ['lottery', 'roulette'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var mins = 1;

    if (bot.hasPermission(bot.getUser(data.user.id), 'queue-order')) {

        if (input.length >= 2) {
            mins = parseInt(_.last(input, 1));
        }
        else {
            mins = 5;
        }

        // Sanity check!
        if (mins < 1 || mins > 120) {
            mins = 5;
        }

        if (input[0] === 'roulette') {
            bot.sendChat('Queue roulette in ' + mins + ' minutes! Add a song and chat within ' + mins + ' minutes to enter.  Winner gets moved up a random number of spots!');
        }
        else {
            bot.sendChat('Queue lottery in ' + mins + ' minutes! Add a song and chat within ' + mins + ' minutes to enter.  Winner gets the #1 spot!');
        }

        setTimeout(function () {
            bot.sendChat("Contest ending in ONE MINUTE - join the line and chat to enter!");
        }, (mins - 1) * 60 * 1000);

        setTimeout(function () {
            // Only select from users active during the lottery
            getActiveDJs(mins, 0, function (activeDJs) {
                if (activeDJs.length > 0) {
                    var randomNumber = _.random(1, activeDJs.length);
                    var winner = activeDJs[(randomNumber - 1)];
                    var message = ":tada: @" + winner.username + " emerges victorious!";
                    transferCustomPoints(null, winner, 1);
                    var currentPosition = bot.getQueuePosition(winner.site_id);
                    if (input[0] === 'roulette') {
                        position = _.random(0, currentPosition - 1);
                    } else {
                        position = 0;
                    }
                    if (currentPosition > 0 && currentPosition > position) {
                        bot.moderateMoveDJ(winner.site_id, position);
                        console.log('[LOTTO] Moving ' + winner.username + ' to position: ' + position);
                        message += ' Moving to position: ' + position;
                    }
                    bot.sendChat(message);
                }
                else {
                    bot.sendChat(":thumbsdown: No one is eligible to win the contest.");
                    console.log('[LOTTO] No one is eligible to win the contest.');
                }
            });
        }, mins * 60 * 1000);
    }
};