exports.names = ['.skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (_.findWhere(room.users, {id: data.uid}).role > 1 || data.uid == room.djs[0].id) {
        logger.warning('[SKIP] ' + data.un + ' skipped ' + room.djs[0].username);
        bot.moderateForceSkip();
        bot.moderateDeleteChat(data.cid);
    }
};
