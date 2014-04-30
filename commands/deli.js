exports.names = ['.deli'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var randomNumber = _.random(1, room.users.length);
    bot.sendChat(":bell: Now serving customer #" + randomNumber + " - sup, " + room.users[(randomNumber-1)].username + "!");
};