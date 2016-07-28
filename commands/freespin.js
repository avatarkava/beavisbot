exports.names = ['freespin'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdManager = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat(config.responses.freeSpin);
};