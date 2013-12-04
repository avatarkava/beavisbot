// Instructs the bot to meh a song.

exports.names = ['.l', '.m'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    console.log('laming song');
    bot.downvote();
};