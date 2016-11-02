exports.names = ['csi'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('http://media1.giphy.com/media/v9rfTQBNqdsSA/giphy.gif');
    setTimeout(function () {
        bot.sendChat('YEAAAAAHHHHHHHHHHHHHHHHHHHHHHH');
    }, 5000);
};1