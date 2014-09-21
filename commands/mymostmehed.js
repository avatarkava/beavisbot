exports.names = ['.mymostmehed'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, sum_down FROM (SELECT songid, sum(downvotes) as sum_down FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY sum(downvotes) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.from.id], function (error, rows) {
    //    if (rows.length > 0) {
    //        bot.sendChat("Least popular songs you've played: " + rows.map(function (row) {
    //            return row['author'] + ' - ' + row['title'] + ' (-' + row['sum_down'] + ')';
    //        }).join(' • '));
    //    } else {
    //        bot.sendChat("You haven't played anything in this room!");
    //    }
    //});
};

