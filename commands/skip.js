exports.names = ['.skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1 || data.from.id == bot.getDJ().id) {
        logger.warning('[SKIP] ' + data.from.username + ' skipped ' + bot.getDJ().username);
        bot.moderateForceSkip();
        bot.moderateDeleteChat(data.id);
    }
};
