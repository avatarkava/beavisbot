exports.names = ['.roll'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (room.staff[data.fromID] > 1) {
        var roll = _.random(1, 6);
        bot.sendChat(data.from + ', you rolled a ' + roll + '!');
    }
};