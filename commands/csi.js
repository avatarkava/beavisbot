exports.names = ['csi'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 300;
exports.cdUser = 300;
exports.cdManager = 300;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('http://media1.giphy.com/media/v9rfTQBNqdsSA/giphy.gif');
    setTimeout(function () {
        bot.sendChat('YEAAAAAHHHHHHHHHHHHHHHHHHHHHHH');
    }, 5000);
};1