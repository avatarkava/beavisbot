exports.names = ['lottery', 'roulette'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var mins = 1;

    if (data.from.role > 1) {

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
            bot.sendChat('Wait list roulette in ' + mins + ' minutes! Chat and be in line within ' + mins + ' minutes to enter.  Winner gets moved up a random number of spots! @djs');
        }
        else {
            bot.sendChat('Wait list lottery in ' + mins + ' minutes! Chat and be in line within ' + mins + ' minutes to enter.  Winner gets the #2 spot! @djs');
        }

        if (mins > 1) {
            setTimeout(function () {
                bot.sendChat("Contest ending in ONE MINUTE - be in line and chat to enter! @djs");
            }, (mins - 1) * 60 * 1000);
        }

        setTimeout(function () {
            // Only select from users active during the lottery
            getActiveDJs(mins, 2, function (activeDJs) {
                if (activeDJs.length > 0) {
                    var randomNumber = _.random(1, activeDJs.length);
                    var winner = activeDJs[(randomNumber - 1)];
                    var message = ":tada: @" + winner.username + " emerges victorious!";
                    transferCustomPoints(null, bot.getUser(winner.site_id), 1);
                    var currentPosition = bot.getWaitListPosition(winner.site_id);
                    var position = 1;
                    if (input[0] === 'roulette') {
                        position = _.random(1, currentPosition - 1);
                    }
                    if (currentPosition > 1 && currentPosition > position) {
                        bot.moderateMoveDJ(winner.site_id, position);
                        console.log('[LOTTO] Moving ' + winner.username + ' from position ' + currentPosition + ' to position: ' + position);
                        message += ' Moving to position ' + (position + 1);
                    } else if (currentPosition <= position) {
                        console.log('[LOTTO] Leaving ' + winner.username + ' in position: ' + currentPosition + '(' + position + ')');
                        message += ' Leaving in position ' + (currentPosition + 1);
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