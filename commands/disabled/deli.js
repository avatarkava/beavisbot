exports.names = ['deli'];
exports.hidden = true;
exports.enabled = false;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    users = bot.getUsers();
    var randomNumber = _.random(1, users.length);
    bot.speak(":bell: Now serving customer #" + randomNumber + " - hey there, " + users[(randomNumber - 1)].username + "!");
};