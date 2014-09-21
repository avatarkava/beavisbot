exports.names = ['.mostgrabbed'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, sum_hearts FROM (SELECT songid, sum(snags) as sum_hearts FROM PLAYS GROUP BY songid ORDER BY sum(snags) DESC LIMIT 5) a INNER JOIN SONGS ON a.songid = SONGS.id', function (error, rows) {
    //    if (rows != null) {
    //        bot.sendChat('Songs with the most total grabs: ' + rows.map(function (row) {
    //            return row['author'] + ' - ' + row['title'] + ' (' + row['sum_hearts'] + ')';
    //        }).join(' • '));
    //    } else {
    //        bot.sendChat('No one has grabbed anything in this room!');
    //    }
    //});
};

