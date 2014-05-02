exports.names = ['.myjoindate'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    joined = _.findWhere(room.users, {id: data.fromID}).dateJoined
    bot.sendChat(data.from + ', you joined on ' + moment.utc(joined).format('dddd, MMMM Do YYYY') + '.');
};