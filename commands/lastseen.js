exports.names = ['.lastseen','.seen'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = smartSplit(data.message, ' ', 1);
    if (input.length < 2) {
        bot.chat('/me usage: .lastseen @username');
        return;
    }
    username = input[1].substring(1);

    db.get("SELECT strftime('%s', lastSeen) AS 'lastSeen' FROM USERS WHERE username = ?", [username], function (error, row) {
        if (row != null) {
            bot.chat(username + ' was last seen ' + timeSince(row.lastSeen) + ' ago.');
        } else {
            bot.chat(username + ' was not found.');
        }
    });
};