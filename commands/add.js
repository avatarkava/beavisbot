exports.names = ['.add'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        var input = data.message.split(' ');
        var username = _.rest(input, 1).join(' ').trim();
        if (username) {
            db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
                bot.moderateAddDJ(row.userid, function() {
                    console.log('Adding ' + username + ' to list: ' + row.userid);
                });
            });
        }
    }
};
