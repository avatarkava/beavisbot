exports.names = ['.uptime'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('up since ' + moment.utc(uptime, 'YYYY-MM-DD HH:mm:ss').calendar() + ' UTC (' + timeSince(uptime.getTime()) + ')');
};