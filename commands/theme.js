exports.names = ['.theme'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var theme = _.rest(input, 1).join(' ');

    if (room.staff[data.fromID] > 2 && theme) {

        if(theme == 'reset' || theme == 'clear') {
            theme = config.responses.theme;
        }

        db.run('REPLACE INTO SETTINGS (name, value, userid, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', ['theme', theme, data.fromID],
            function(error) {
                if (error) {
                    bot.chat('/me An error occurred.');
                    console.log('Error while updating theme. ', error);
                } else {
                    console.log("[THEME] " + theme);
                    bot.chat('/me Theme updated.')
                }
            });
    }
    else {
        db.get("SELECT name AS 'theme', username, strftime('%s', timestamp) AS 'lastUpdate' FROM SETTINGS s INNER JOIN USERS ON s.userid = USERS.userid WHERE name = ? LIMIT 1", [], function (error, row) {
            if (row != null) {
                message = row.theme;
                if(room.staff[data.fromID] > 1) {
                    message += ' (set ' + timeSince(row.lastUpdate) + ' ago by ' + row.username + ')';
                }
                bot.chat('/me ' + message);

            } else {
                bot.chat('/me ' + config.responses.theme);
            }
        });
    }
};