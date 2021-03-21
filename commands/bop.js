// Instructs the bot to upvote a song. Only available for staff (not resident DJs).
exports.names = ['bop', 'woot', 'up'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {    
    bot.bop();
};