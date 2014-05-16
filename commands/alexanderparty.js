exports.names = ['.alexanderparty'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    var strings = [
        'http://25.media.tumblr.com/ef757dee931df12d9f5e2202ee624f0c/tumblr_mpmkp9UbXm1qdljtto1_r2_500.gif'
    ];
    var randomIndex = _.random(0, strings.length-1);
    bot.sendChat(strings[randomIndex]);
};