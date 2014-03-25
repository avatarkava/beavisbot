exports.names = ['.remove', '.rm', '.rmafk', '.rmidle'];
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
                if(input[0] == '.rmafk' || input[0] == '.rmidle') {
                    bot.chat(input[1] + ' Everyone is welcome to listen to the music but we ask that if you wish to DJ you be able to at least respond to an @ mention in chat.');
                }
                console.log('Removing ' + input[1] + ' from list: ' + row.userid);
            });
        }
    }
};