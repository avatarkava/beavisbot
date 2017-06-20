exports.names = ['time', 'utc'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('checks the clock: ' + moment.utc().format('HH:mm:ss') + ' UTC on ' + moment.utc().format('dddd MMMM Do, YYYY'));
};