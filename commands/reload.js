exports.names = ['.reload'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (room.staff[data.fromID] > 2) {
        bot.chat("/me goes softly into that good night. Reload should happen automatically in a few moments...");
        console.log('[CHAT] Bot killed by ' + data.from);
        setTimeout(function () {
            process.exit(1);
        }, 3000);
    }
    else {
        // No permissions, so just ignore them.
    }
}