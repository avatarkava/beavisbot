// Instructs the bot to downvote a song. Available to VIPs and higher.
exports.names = ['down'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (bot.hasPermission(bot.getUser(data.user.id), 'skip')) {
        bot.meh();
    }
};