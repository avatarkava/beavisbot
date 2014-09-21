exports.names = ['.theme'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var theme = _.rest(input, 1).join(' ');

    if (data.from.role > 2 && theme) {

        if (theme == 'reset' || theme == 'clear') {
            theme = config.responses.theme;
        }

        //db.run('REPLACE INTO SETTINGS (name, value, userid, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', ['theme', theme, data.from.id],
        //    function (error) {
        //        if (error) {
        //            bot.sendChat('An error occurred.');
        //            logger.error('Error while updating theme. ', error);
        //        } else {
        //            logger.info("[THEME] " + theme);
        //            bot.sendChat('Theme updated, ' + data.from.username);
        //        }
        //        bot.moderateDeleteChat(data.id);
        //    });
    }
    else {
        //db.get("SELECT value AS 'theme', username, timestamp FROM SETTINGS s INNER JOIN USERS ON s.userid = USERS.userid WHERE name = ? LIMIT 1", ['theme'], function (error, row) {
        //    if (row != null) {
        //        message = row.theme;
        //        if (data.from.role > 2) {
        //            message += ' (set ' + timeSince(row.timestamp) + ' by ' + row.username + ')';
        //        }
        //        bot.sendChat('/me ' + message);
        //
        //    } else {
        //        bot.sendChat('/me ' + config.responses.theme);
        //    }
        //});
    }
};