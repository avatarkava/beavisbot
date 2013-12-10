exports.names = ['i enjoy that band.'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    setTimeout(function() {
        bot.chat('Me too!');
    }, 1200);
};