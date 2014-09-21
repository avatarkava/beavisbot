exports.names = ['.worstdjs'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT username, down from (SELECT userid, sum(downvotes) as down FROM PLAYS GROUP BY userid) a INNER JOIN USERS ON a.userid = USERS.userid ORDER BY down desc LIMIT 5', function (error, rows) {
    //    if (rows.length > 0) {
    //        bot.sendChat('The DJs with the most mehs accrued in this room: ' + rows.map(function (row) {
    //            return row['username'] + ' (-' + row['down'] + ')';
    //        }).join(' • '));
    //    } else {
    //        bot.sendChat('No one has mehed anything in this room!');
    //    }
    //});
};