// Instructs the bot to woot a song. Only available for bouncers and higher.

exports.names = ['.a', '.w'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        bot.upvote();
    }
};