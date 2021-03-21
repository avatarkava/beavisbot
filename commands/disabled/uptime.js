exports.names = ['uptime'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('online ' + timeSince(uptime.getTime(), true) + ' (since ' + moment.utc(uptime.getTime()).calendar() + ')');
};