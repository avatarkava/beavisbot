exports.names = ['lottery', 'roulette'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 60;
exports.cdUser = 60;
exports.cdStaff = 60;
exports.minRole = PERMISSIONS.BOUNCER;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var mins = 1;


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

    if (input[0].toLowerCase() === 'roulette') {
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
        var minPosition = 2;
        getActiveDJs(mins, minPosition, function (activeDJs) {
                if (activeDJs.length > 0) {
                    var randomNumber = _.random(0, activeDJs.length - 1);
                    var winner = activeDJs[randomNumber];
                    var winnerId = parseInt(winner.site_id);
                    var message = ":tada: @" + winner.username + " emerges victorious!";
                    transferCustomPoints(null, bot.getUser(winnerId), 1);
                    var currentPosition = bot.getWaitListPosition(winnerId);
                    var position = minPosition;
                    if (input[0] === 'roulette') {
                        position = _.random(minPosition, currentPosition - 1);
                    }
                    if (currentPosition > minPosition && currentPosition > position) {
                        bot.moderateMoveDJ(winnerId, position);
                        console.log('[LOTTO] Moving ' + winner.username + ' from position ' + currentPosition + ' to position: ' + position);
                        message += ' Moving to position ' + position;
                    } else if (currentPosition == -1) {
                        console.log('[LOTTO] ' + winner.username + ' detected with waitlist position of -1');
                        message += ' Not finding ' + winner.username + '\'s position in the wait list.  Need some help @staff';
                    } else if (currentPosition <= position) {
                        console.log('[LOTTO] Leaving ' + winner.username + ' in position: ' + currentPosition + '(' + position + ')');
                        message += ' Leaving in position ' + currentPosition;
                    }
                    bot.sendChat(message);
                }
                else {
                    bot.sendChat(":thumbsdown: No one is eligible to win the contest.");
                    console.log('[LOTTO] No one is eligible to win the contest.');
                }
            }
        );
    }, mins * 60 * 1000);

};
