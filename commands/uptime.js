exports.names = ['.uptime'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('up since ' + moment.utc(uptime.getTime()).calendar() + ' UTC (' + moment.utc(uptime.getTime()).fromNow() + ')');
};