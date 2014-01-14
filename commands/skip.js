exports.names = ['.skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        bot.moderateForceSkip();
    }
};
