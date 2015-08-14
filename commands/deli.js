exports.names = ['.deli'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    users = bot.getUsers();
    var randomNumber = _.random(1, users.length);
    bot.sendChat(":bell: Now serving customer #" + randomNumber + " - hey there, " + users[(randomNumber - 1)].username + "!");
};