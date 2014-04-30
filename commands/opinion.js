exports.names = ['.opinion', '.patrice'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://i.imgur.com/CifeChq.gif',
        'http://i.imgur.com/SH6qTAI.png'
    ];
    var randomIndex = _.random(0, strings.length-1);
    bot.sendChat(strings[randomIndex]);
};