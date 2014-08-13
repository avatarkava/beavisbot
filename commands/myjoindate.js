exports.names = ['.myjoindate'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    joined = _.findWhere(room.users, {id: data.fid}).dateJoined
    bot.sendChat(data.from + ', you joined ' + timeSince(joined) + '.');
};