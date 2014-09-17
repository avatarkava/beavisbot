exports.names = ['.updateauthor', '.updateartist', '.setartist'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    if (data.from.role > 1) {
        var input = data.message.split(' ');
        var artist = _.rest(input, 2).join(' ');

        db.get('SELECT author, title FROM SONGS where id = ?', input[1], function(err, row) {
            if (row != null) {
                db.run('UPDATE SONGS SET author = ? WHERE id = ?', [artist, input[1]],
                    function(error) {
                        if (error) {
                            bot.sendChat('An error occurred.');
                            logger.error('Error while updating song ' + input[1], error);
                        } else {
                            bot.sendChat('Artist updated.')
                        }
                    });
            }
            else {
                bot.sendChat('Song not found for update.  Usage: .updateartist [songid] [artist]');
            }
        });
    } else {
        bot.sendChat('Only managers and hosts are allowed to update song metadata.');
    }
};
