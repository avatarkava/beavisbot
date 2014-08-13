exports.names = ['.event', '.calendar'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var event = _.rest(input, 1).join(' ');

    if (_.findWhere(room.users, {id: data.fid}).permission > 2 && event) {

        if(event == 'reset' || event == 'clear') {
            event = 'No events currently scheduled.'
        }

        db.run('REPLACE INTO SETTINGS (name, value, userid, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', ['event', event, data.fid],
            function(error) {
                if (error) {
                    bot.sendChat('An error occurred.');
                    bot.log('Error while updating event. ', error);
                } else {
                    bot.log("[EVENT] " + event);
                    bot.sendChat('Event updated, ' + data.from);
                }
                bot.moderateDeleteChat(data.cid);
            });
    }
    else {
        db.get("SELECT value AS 'event', username, timestamp FROM SETTINGS s INNER JOIN USERS ON s.userid = USERS.userid WHERE name = ? LIMIT 1", ['event'], function (error, row) {
            if (row != null) {
                message = row.event;
                if(_.findWhere(room.users, {id: data.fid}).permission > 2) {
                    message += ' (set ' + timeSince(row.timestamp) + ' by ' + row.username + ')';
                }
                bot.sendChat('/me ' + message);

            } else {
                bot.sendChat('No events currently scheduled.');
            }
        });
    }
};