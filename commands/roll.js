// roll

exports.names = ['.roll'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    bot.chat(data.from + ', you rolled a ' + Math.ceil(Math.random() * 6) + '!');
};