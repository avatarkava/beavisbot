exports.names = ['.owner', '.feedback'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('AvatarKava owns the BeavisBot fork of SparkleBot. Make bug reports and requests here, please: https://github.com/AvatarKava/BeavisBot/issues');
};
