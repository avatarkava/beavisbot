// Instructs the bot to woot a song.

exports.names = ['.a', '.w'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    console.log('awesomeing song');
    bot.upvote();
};