// ping command

exports.names = ['.ping', 'ping'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var rand = Math.random();
    if (rand < 0.5) {
        bot.chat('You\'re still here, ' + data.from + '!');
    } else {
        bot.chat('Still here, ' + data.from + '!');
    }
};