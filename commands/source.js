exports.names = ['source'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('Source code: https://github.com/avatarkava/beavisbot.  Feel free to submit pull requests!');
};