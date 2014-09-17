exports.names = ['.christianparty'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://replygif.net/i/612.gif'
    ];
    var randomIndex = _.random(0, strings.length - 1);
    bot.sendChat(strings[randomIndex]);
};