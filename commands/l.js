// Instructs the bot to meh a song. Available to bouncers and higher.

exports.names = ['.l', '.m'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        bot.downvote();
    }
};