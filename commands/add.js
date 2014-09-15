exports.names = ['.add'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (_.findWhere(room.users, {id: data.uid}).role > 1) {
        bot.moderateDeleteChat(data.cid);
        var input = data.message.split(' ');
        var username = _.rest(input, 1).join(' ').trim();
        if (username) {
            user = _.findWhere(room.users, {username: username.substring(1)});
            if (user) {
                bot.moderateAddDJ(parseInt(user.id), function() {
                    bot.log('Adding ' + username + ' to list: ' + user.id);
                });
            }
        }
    }
};
