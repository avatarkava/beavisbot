exports.names = ['reptar sucks'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    bot.chat('OH NO YOU DIDN\'T');
    setTimeout(function() {
        bot.chat('RAWR!!!');
    }, 1000);
};