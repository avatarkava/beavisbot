exports.names = ['roll'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var maxValue = 6;

    var input = _.rest(data.message.split(' '), 1).join(' ').trim();

    if (input.length > 0) {
        maxValue = parseInt(input.replace(/\D/g, ""));
    }

    if (maxValue > 0 && maxValue < 99999) {
        var roll = _.random(1, maxValue);
        bot.sendChat('@' + data.from.username + ', you rolled a ' + roll + '!');
    }
    else {
        bot.sendChat('http://www.clownshoes.net/clownshoes.gif');
    }

};