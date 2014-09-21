exports.names = ['.mostwooted'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, sum_up FROM (SELECT songid, sum(upvotes) as sum_up FROM PLAYS GROUP BY songid ORDER BY sum(upvotes) DESC LIMIT 5) a INNER JOIN SONGS ON a.songid = SONGS.id', function (error, rows) {
    //    if (rows != null) {
    //        bot.sendChat('Songs with the most total woots: ' + rows.map(function (row) {
    //            return row['author'] + ' - ' + row['title'] + ' (+' + row['sum_up'] + ')';
    //        }).join(' • '));
    //    } else {
    //        bot.sendChat('No one has wooted anything in this room!');
    //    }
    //});
};

