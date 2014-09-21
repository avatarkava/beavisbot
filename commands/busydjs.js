// busy DJs

exports.names = ['.busydjs'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT username, spins from (SELECT userid, count(*) as spins FROM PLAYS GROUP BY userid) a INNER JOIN USERS ON a.userid = USERS.userid ORDER BY spins desc LIMIT 5', function (error, rows) {
    //    bot.sendChat('DJs with the most spins: ' + rows.map(function (row) {
    //        return row['username'] + ' (+' + row['spins'] + ')';
    //    }).join(' • '));
    //});
};