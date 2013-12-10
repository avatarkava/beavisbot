// hugs

exports.names = ['hugs ' + config.botinfo.botname];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (Math.random() < 0.3) {
        bot.chat('Awww!');
    }
    setTimeout(function() {
        bot.chat('/em hugs ' + data.from);
    }, 1000);
};