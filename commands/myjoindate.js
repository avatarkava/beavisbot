exports.names = ['.myjoindate'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    joined = _.findWhere(room.users, {id: data.uid}).dateJoined
    bot.sendChat(data.un + ', you joined ' + timeSince(joined) + '.');
};