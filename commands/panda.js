exports.names = ['.panda'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://fc04.deviantart.net/fs70/f/2011/202/7/7/nyan_panda_by_cucureuill-d419c1k.png'
    ];
    var randomIndex = Math.floor(Math.random() * strings.length);
    bot.chat(strings[randomIndex]);
};