// Instructs the bot to upvote a song. Only available for staff (not resident DJs).
exports.names = ['up'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1) {
        bot.woot();
    }
};