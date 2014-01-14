exports.names = ['.move', '.mv'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        var input = data.message.split(' ');
        if (input.length == 3 && input[1].substring(0,1) == '@') {
            username = input[1].substring(1);
            position = parseInt(input[2]);
            db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username], function (error, row) {
                bot.moveDJ(row.userid, parseInt(input[2]));
                console.log('Moving ' + input[1] + ' to position: ' + input[2]);
            });
        }
    }
};
