exports.names = ['.opinion', '.patrice'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://i.imgur.com/CifeChq.gif',
        'http://i.imgur.com/SH6qTAI.png'
    ];
    var randomIndex = Math.floor(Math.random() * strings.length);
    bot.chat(strings[randomIndex]);
};