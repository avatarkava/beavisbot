// Instructs the bot to woot a song. Only available for bouncers and higher.
exports.names = ['.w'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (_.findWhere(room.users, {id: data.uid}).role > 1) {
        bot.woot();
    }
};