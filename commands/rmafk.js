exports.names = ['.rmafk', '.rmidle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        var input = data.message.split(' ');
        if (input.length == 2 && input[1].substring(0,1) == '@') {
            username = input[1].substring(1);
            db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username], function (error, row) {
                bot.moderateRemoveDJ(row.userid);
                bot.chat('@' + username + ' Everyone is welcome to AFK and listen to the music but we ask that if you wish to DJ you must be able to at the very least respond to an @ mention in chat.');
                console.log('Removing ' + input[1] + ' from list: ' + row.userid);
            });
        }
    }
};