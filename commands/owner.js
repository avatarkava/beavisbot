exports.names = ['owner', 'feedback'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('/me avatarkava is the author of beavisbot. Make bug reports and requests here, please: https://github.com/avatarkava/beavisbot/issues');
};
