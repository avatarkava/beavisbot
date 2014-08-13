// Instructs the bot to meh a song. Available to bouncers and higher.
exports.names = ['.m'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (_.findWhere(room.users, {id: data.fid}).permission > 1) {
        bot.meh();
    }
};