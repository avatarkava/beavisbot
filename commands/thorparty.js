exports.names = ['.thorparty'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://www.kiss925.com/files/gif.gif',
        'http://media2.giphy.com/media/brDwVn5kGIz3W/giphy.gif'
    ];
    var randomIndex = _.random(0, strings.length-1);
    bot.sendChat(strings[randomIndex]);
};