exports.names = ['.ryanparty'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://i.imgur.com/GEt9OOv.gif',
        'http://i.imgur.com/S7LMDUo.gif.jpg'
    ];
    var randomIndex = _.random(0, strings.length - 1);
    bot.sendChat(strings[randomIndex]);
};
