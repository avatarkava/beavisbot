exports.names = ['license'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('/me MIT License - Full license available at https://github.com/avatarkava/beavisbot/blob/master/LICENSE');
};
