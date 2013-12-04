// ping command

exports.names = ['ping'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(context, data) {
    var rand = Math.random();
    if (rand < 0.5) {
        context.bot.chat('You\'re still here, ' + data.from + '!');
    } else {
        context.bot.chat('Still here, ' + data.from + '!');
    }
};