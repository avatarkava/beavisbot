// best DJs

exports.names = ['.bestdjs'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT username, up from (SELECT userid, sum(upvotes) as up FROM PLAYS GROUP BY userid) a INNER JOIN USERS ON a.userid = USERS.userid ORDER BY up desc LIMIT 5', function (error, rows) {
    //    bot.sendChat('DJs with the most woots earned: ' + rows.map(function (row) {
    //        return row['username'] + ' (+' + row['up'] + ')';
    //    }).join(' • '));
    //});
};