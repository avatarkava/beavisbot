exports.names = ['.skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (data.from.role > 1 || data.from.id == room.djs[0].id) {
        logger.warning('[SKIP] ' + data.from.username + ' skipped ' + room.djs[0].username);
        bot.moderateForceSkip();
        bot.moderateDeleteChat(data.id);
    }
};
