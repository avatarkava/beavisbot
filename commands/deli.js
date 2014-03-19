exports.names = ['.deli'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var randomNumber = Math.floor(Math.random() * 100);
    bot.chat("DING! Now serving customer #" + randomNumber);
};