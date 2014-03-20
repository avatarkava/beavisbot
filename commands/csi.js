exports.names = ['.csi'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.chat('/me dons sunglasses.... http://media1.giphy.com/media/v9rfTQBNqdsSA/giphy.gif');
    setTimeout(function(){bot.chat('YEAAAAAHHHHHHHHHHHHHHHH')}, 3000);
};