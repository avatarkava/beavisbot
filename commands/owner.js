exports.names = ['owner', 'feedback'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('AvatarKava is the author of BeavisBot. Make bug reports and requests here, please: https://github.com/avatarkava/beavisbot-dubtrack-fm/issues');
};
