exports.names = ['owner', 'feedback'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('/me avatarkava is the author of beavisbot. Make bug reports and requests here, please: https://github.com/avatarkava/beavisbot/issues');
};
