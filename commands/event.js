exports.names = ['.event', '.calendar'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var event = _.rest(input, 1).join(' ');

    if (room.staff[data.fromID] > 2 && event) {

        if(event == 'reset' || event == 'clear') {
            event = 'No events currently scheduled.'
        }

        db.run('REPLACE INTO SETTINGS (name, value, userid, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', ['event', event, data.fromID],
            function(error) {
                if (error) {
                    bot.chat('/me An error occurred.');
                    console.log('Error while updating event. ', error);
                } else {
                    console.log("[EVENT] " + event);
                    bot.chat('/me Event updated.')
                }
            });
    }
    else {
        db.get("SELECT value AS 'event', username, strftime('%s', timestamp) AS 'lastUpdate' FROM SETTINGS s INNER JOIN USERS ON s.userid = USERS.userid WHERE name = ? ORDER BY id DESC LIMIT 1", ['event'], function (error, row) {
            if (row != null) {
                message = row.event;
                if(room.staff[data.fromID] > 1) {
                    message += ' (set ' + timeSince(row.lastUpdate) + ' ago by ' + row.username + ')';
                }
                bot.chat('/me ' + message);

            } else {
                bot.chat('/me No events currently scheduled');
            }
        });
    }
};