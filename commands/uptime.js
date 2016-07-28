exports.names = ['uptime'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdManager = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('/me online ' + timeSince(uptime.getTime(), true) + ' (since ' + moment.utc(uptime.getTime()).calendar() + ')');
};