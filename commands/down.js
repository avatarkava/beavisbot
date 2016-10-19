// Instructs the bot to downvote a song. Available to VIPs and higher.
exports.names = ['down'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {
    bot.meh();
};