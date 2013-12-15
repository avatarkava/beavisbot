exports.names = ['.joindate'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    bot.chat(data.from + ', you joined on ' + _.findWhere(room.users, {id: data.fromID}).dateJoined + '!');
};