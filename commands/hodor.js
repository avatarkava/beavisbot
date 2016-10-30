exports.names = ['hodor'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('Hodor!');
};