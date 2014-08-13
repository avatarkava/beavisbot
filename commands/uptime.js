exports.names = ['.uptime'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat(timeSince(uptime.getTime()) + ' (' + uptime.getTime() + ')');
};