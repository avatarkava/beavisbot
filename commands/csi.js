exports.names = ['.csi'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.chat('/me dons sunglasses....');
    setTimeout(function(){bot.chat('YEAAAAAHHHHHHHHHHHHHHHH')}, 3000);
};