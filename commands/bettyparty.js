exports.names = ['.bettyparty'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://31.media.tumblr.com/tumblr_m4k3xogOGu1rn95k2o1_250.gif',
        'http://belieber.files.wordpress.com/2010/10/2iurhw3.gif'
    ];
    var randomIndex = _.random(0, strings.length - 1);
    bot.sendChat(strings[randomIndex]);
};