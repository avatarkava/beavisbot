exports.names = ['.updateauthor', '.updateartist', '.setartist'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (room.staff[data.fromID] > 1) {
        var input = data.message.split(' ');
        var artist = _.rest(input, 2).join(' ');
    
        db.run('UPDATE SONGS SET author = ? WHERE id = ?', [artist, input[1]],
            function(error) {
                if (error) {
                    bot.chat('An error occurred.');
                    console.log('Error while updating song ' + input[1], error);
                } else {
                    bot.chat('Author updated.')
                }
        });
    } else {
        bot.chat('Only managers and hosts are allowed to update song metadata.');
    }
};
