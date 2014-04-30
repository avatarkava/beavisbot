exports.names = ['.lastseen','.seen'];
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

    db.get("SELECT strftime('%s', lastSeen) AS 'lastSeen' FROM USERS WHERE username = ?", [username], function (error, row) {
        if (row != null) {
            bot.sendChat(username + ' was last seen ' + timeSince(row.lastSeen) + ' ago.');
        } else {
            bot.sendChat(username + ' was not found.');
        }
    });
};