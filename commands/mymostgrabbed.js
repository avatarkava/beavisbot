exports.names = ['.mymostgrabbed'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, sum_hearts FROM (SELECT songid, sum(snags) as sum_hearts FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY sum(snags) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.from.id], function (error, rows) {
    //    if (rows != null) {
    //        bot.sendChat('Your songs with the most grabs: ' + rows.map(function (row) {
    //            return row['author'] + ' - ' + row['title'] + ' (' + row['sum_hearts'] + ')';
    //        }).join(' • '));
    //    } else {
    //        bot.sendChat("You haven't played anything in this room!");
    //    }
    //});
};

