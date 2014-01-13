exports.names = ['.emoji'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.chat('Emoji List: http://www.emoji-cheat-sheet.com');
};