exports.names = ['.mostmehed', '.mostmehd'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, sum_down FROM (SELECT songid, sum(downvotes) as sum_down FROM PLAYS GROUP BY songid ORDER BY sum(downvotes) DESC LIMIT 5) a INNER JOIN SONGS ON a.songid = SONGS.id', function (error, rows) {
    //    if (rows != null) {
    //        bot.sendChat('Least popular songs all-time: ' + rows.map(function (row) {
    //            return row['author'] + ' - ' + row['title'] + ' (-' + row['sum_down'] + ')';
    //        }).join(' • '));
    //    } else {
    //        bot.sendChat('No one has mehed anything in this room!');
    //    }
    //});
};

