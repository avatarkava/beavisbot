exports.names = ['.skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (_.findWhere(room.users, {id: data.fid}).permission > 1 || data.fid == room.djs[0].id) {
        bot.log('[SKIP] ' + data.from + ' skipped ' + room.djs[0].username);
        bot.moderateForceSkip();
    }
};
