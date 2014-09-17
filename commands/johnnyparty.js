exports.names = ['.johnnyparty'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        ':( You have a boyfriend, @PirateLizz...'
    ];
    var randomIndex = _.random(0, strings.length - 1);
    bot.sendChat(strings[randomIndex]);
};