exports.names = ['.remove', '.rm', '.rmafk', '.rmidle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (_.findWhere(room.users, {id: data.fid}).permission > 1) {
        bot.moderateDeleteChat(data.cid);
        var input = data.message.split(' ');
        var username = _.rest(input, 1).join(' ').trim();
        if (username) {
            db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
                bot.moderateRemoveDJ(row.userid);
                if(input[0] == '.rmafk' || input[0] == '.rmidle') {
                    bot.sendChat(username + ' ' + config.responses.activeDJRemoveMessage);
                    db.run('UPDATE DISCIPLINE SET warns = 0, removes = removes + 1, lastAction = CURRENT_TIMESTAMP WHERE userid = ?', [row.userid]);
                }
                bot.log('[REMOVE] ' + data.from + ' removed ' + username + ' from wait list');
            });
        }
    }
};
