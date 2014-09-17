exports.names = ['.myjoindate'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    joined = data.from.joined
    bot.sendChat(data.from.username + ', you joined ' + timeSince(joined) + '.');
};