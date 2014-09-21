exports.names = ['.mymostwooted'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, sum_up FROM (SELECT songid, sum(upvotes) as sum_up FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY sum(upvotes) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.from.id], function (error, rows) {
    //    if (rows.length > 0) {
    //        bot.sendChat('Your songs with the most woots: ' + rows.map(function (row) {
    //            return row['author'] + ' - ' + row['title'] + ' (+' + row['sum_up'] + ')';
    //        }).join(' • '));
    //    } else {
    //        bot.sendChat("You haven't played anything in this room!");
    //    }
    //});
};

