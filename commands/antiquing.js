// ICA inside joke

exports.names = ['antiquing?', 'antiquing'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    bot.chat('\"Antiquing\" is the act of shopping, identifying, negotiating, or '
            + 'bargaining for antiques. Items can be bought for personal use, gifts, and '
            + 'in the case of brokers and dealers, profit.');
};