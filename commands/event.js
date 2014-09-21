exports.names = ['.event', '.calendar'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var event = _.rest(input, 1).join(' ');

    if (data.from.role > 2 && event) {

        if (event == 'reset' || event == 'clear') {
            event = 'No events currently scheduled.'
        }

        //db.run('REPLACE INTO SETTINGS (name, value, userid, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', ['event', event, data.from.id],
        //    function (error) {
        //        if (error) {
        //            bot.sendChat('An error occurred.');
        //            logger.error('Error while updating event. ', error);
        //        } else {
        //            logger.info("[EVENT] " + event);
        //            bot.sendChat('Event updated, ' + data.from.username);
        //        }
        //        bot.moderateDeleteChat(data.id);
        //    });
    }
    else {
        //db.get("SELECT value AS 'event', username, timestamp FROM SETTINGS s INNER JOIN USERS ON s.userid = USERS.userid WHERE name = ? LIMIT 1", ['event'], function (error, row) {
        //    if (row != null) {
        //        message = row.event;
        //        if (data.from.role > 2) {
        //            message += ' (set ' + timeSince(row.timestamp) + ' by ' + row.username + ')';
        //        }
        //        bot.sendChat('/me ' + message);
        //
        //    } else {
        //        bot.sendChat('No events currently scheduled.');
        //    }
        //});
    }
};