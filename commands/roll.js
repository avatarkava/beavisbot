exports.names = ['.roll'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {

    var maxValue = 6;

    var input = _.rest(data.message.split(' '), 1).join(' ').trim();
    if (input.length > 0) {
        maxValue = parseInt(input.replace(/[^0-9]/g, ""));
    }

    if (maxValue > 0) {
        var roll = _.random(1, maxValue);
        bot.sendChat(data.from + ', you rolled a ' + roll + '!');
    }
};