exports.names = ['.bettyparty'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://31.media.tumblr.com/tumblr_m4k3xogOGu1rn95k2o1_250.gif',
        'http://belieber.files.wordpress.com/2010/10/2iurhw3.gif'
    ];
    var randomIndex = Math.floor(Math.random() * strings.length);
    bot.chat(strings[randomIndex]);
};