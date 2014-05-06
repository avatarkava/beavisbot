exports.names = ['.roll'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var roll = _.random(1, 6);
    bot.sendChat(data.from + ', you rolled a ' + roll + '!');
};