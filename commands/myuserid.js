exports.names = ['.myuserid'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    bot.chat(data.from + ', your user ID is ' + data.fromID);
};