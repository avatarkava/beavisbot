exports.names = ['.csi'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('/me dons sunglasses.... http://media1.giphy.com/media/v9rfTQBNqdsSA/giphy.gif');
    setTimeout(function () {
        bot.sendChat('YEAAAAAHHHHHHHHHHHHHHHHHHHHHHH')
    }, 3000);
};