exports.names = ['time', 'utc'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('/me checks the clock: ' + moment.utc().format('HH:mm:ss') + ' UTC');
};