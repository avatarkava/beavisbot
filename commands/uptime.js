exports.names = ['.uptime'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var cur = new Date().getTime() - uptime.getTime();
    var days = Math.floor(cur / 86400000);
    cur = cur % 86400000;
    var hours = Math.floor(cur / 3600000);
    cur = cur % 3600000;
    var minutes = Math.floor(cur / 60000);
    cur = cur % 60000;
    var response = 'Uptime: ';
    if (days > 0) {
        response += days + ' days, ';
    }
    response += (hours + ' hours, ' + minutes + ' minutes, '
        + Math.floor(cur/1000) + ' seconds.');
    bot.chat(response);
};