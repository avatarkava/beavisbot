exports.names = ['.remove', '.rm', '.rmafk', '.rmidle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        var input = data.message.split(' ');
        var username = _.rest(input, 1).join(' ');
        if (username) {
            db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
                bot.moderateRemoveDJ(row.userid);
                if(input[0] == '.rmafk' || input[0] == '.rmidle') {
                    bot.chat(username + ' ' + config.responses.activeDJRemoveMessage);
                }
                console.log('Removing ' + username + ' from list: ' + row.userid);
            });
        }
    }
};
