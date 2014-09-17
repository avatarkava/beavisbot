exports.names = ['.phrasing'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://penguinssauce.com/wp-content/uploads/2014/04/phrasing-first-boom.gif'
    ];
    var randomIndex = _.random(0, strings.length - 1);
    bot.sendChat(strings[randomIndex]);
};
