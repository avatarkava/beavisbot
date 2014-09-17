exports.names = ['.reload','.reboot','.restart'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1) {
        bot.sendChat("http://media.giphy.com/media/PllNNHVRrlVJe/giphy.gif");
        logger.error('[KILL] Bot killed by ' + data.from.username);
        setTimeout(function () {
            process.exit(1);
        }, 3000);
    }
}