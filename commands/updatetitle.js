exports.names = ['.updatetitle', '.settitle'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        var input = data.message.split(' ');
        var title = decodeURI(_.rest(input, 2).join(' '));
    
        db.run('UPDATE SONGS SET title = ? WHERE id = ?', [title, input[1]],
            function(error) {
                if (error) {
                    bot.chat('An error occurred.');
                    console.log('Error while updating song ' + input[1], error);
                } else {
                    bot.chat('Title updated.')
                }
        });
    } else {
        bot.chat('Only managers and hosts are allowed to update song metadata.');
    }
};
