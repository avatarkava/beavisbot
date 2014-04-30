exports.names = ['.ping'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('Still here, ' + data.from + '!');
};
