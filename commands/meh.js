exports.names = ['.meh'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (_.findWhere(room.users, {id: data.fid}).permission > 1) {
        bot.moderateDeleteChat(data.cid);
        var message = "";
        var input = _.rest(data.message.split(' '), 1).join(' ').trim();
        if (input.length > 1) {
            message = input + ' ';
        }

        message += config.responses.mehReminder;
        bot.sendChat(message);
    }
};