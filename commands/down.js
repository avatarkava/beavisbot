// Instructs the bot to downvote a song. Available to VIPs and higher.
exports.names = ['down'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1) {
        bot.meh();
    }
};