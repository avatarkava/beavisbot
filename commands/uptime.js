exports.names = ['uptime'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('/me online ' + timeSince(uptime.getTime(), false) + ' ( since ' + moment.utc(uptime.getTime()).calendar() + ')');
};