exports.names = ['.move', '.mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        var input = data.message.split(' ');
        if (input.length >= 3) {
            var username = _.rest(input, 1)..pop().join(' ');
            position = parseInt(_.last(input, 1));
            db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
                bot.moderateAddDJ(row.userid, function() {
                    bot.moveDJ(row.userid, position);
                });
                console.log('Moving ' + username + ' to position: ' + position);
            });
        }
    }
};
