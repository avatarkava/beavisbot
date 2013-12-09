// best DJs

exports.names = ['.bestdjs', 'bestdjs'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT username, up from (SELECT userid, sum(upvotes) as up FROM PLAYS GROUP BY userid) a INNER JOIN USERS ON a.userid = USERS.userid ORDER BY up desc LIMIT 5', function(error, rows) {
        bot.chat('The DJs with the most points accrued in this room: ' + rows.map(function(row) { return row['username'] + ': ' + row['up'] + ' points'; }).join(', '));
    });
};