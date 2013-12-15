exports.names = ['.reptar', 'reptar'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var rand = Math.random();
    if (rand < 0.05) {
        bot.chat('That band is pretty awesome.');
    } else if (rand < 0.10) {
        bot.chat('Good morning!');
    } else if (rand < 0.3) {
        bot.chat('Rawr!');
    } else if (rand < 0.5) {
        bot.chat('rawr!');
    } else if (rand < 0.7) {
        bot.chat('RAWR!');
    } else if (rand < 0.9) {
        bot.chat('rawr.');
    } else {
        bot.chat('RAWR!!!');
    }
};