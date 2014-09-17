exports.names = ['.lastseen', '.seen'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    if (params.length < 1) {
        bot.sendChat('/me usage: .lastseen @username');
        return;
    }

    username = params.join(' ').trim().substring(1);

    db.get("SELECT username, lastSeen FROM USERS WHERE username = ? COLLATE NOCASE", [username], function (error, row) {
        if (row != null) {
            bot.sendChat(row.username + ' was seen ' + timeSince(row.lastSeen) + '.');
        } else {
            bot.sendChat(username + ' was not found.');
        }
    });
};