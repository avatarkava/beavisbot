// cat facts!

exports.names = ['.debug'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 3) {
        bot.chat(JSON.stringify(room.media));
    }
};