exports.names = ['.worstdjs', 'worstdjs'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT username, down from (SELECT userid, sum(downvotes) as down FROM PLAYS GROUP BY userid) a INNER JOIN USERS ON a.userid = USERS.userid ORDER BY down desc LIMIT 5', function(error, rows) {
        if (rows.length > 0) {
            bot.chat('The DJs with the most lames accrued in this room: ' + rows.map(function(row) { return row['username'] + ': ' + row['down'] + ' lames'; }).join(', '));
        } else {
            bot.chat('No one has lamed anything in this room!');
        }
    });
};