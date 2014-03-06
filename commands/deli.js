exports.names = ['.rodsquad'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://media.giphy.com/media/NBvCrzQgLh9cc/giphy.gif',
        'http://glogreen.files.wordpress.com/2011/02/glowstickanime.gif'
    ];
    var randomIndex = Math.floor(Math.random() * strings.length);
    bot.chat(strings[randomIndex]);
};