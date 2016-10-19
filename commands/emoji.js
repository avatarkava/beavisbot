exports.names = ['emoji'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('Emoji List: http://www.emoji-cheat-sheet.com');
};