exports.names = ['.roll'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (room.staff[data.fromID] > 1) {
        bot.chat(data.from + ', you rolled a ' + Math.ceil(Math.random() * 6) + '!');
    }
};