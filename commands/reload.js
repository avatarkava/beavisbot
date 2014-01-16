exports.names = ['.reload'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (room.staff[data.fromID] > 2) {
        bot.chat("/me :wave: brb...");
        console.log('[CHAT] Bot killed by ' + data.from);
        setTimeout(function () {
            process.exit(1);
        }, 3000);
    }
}