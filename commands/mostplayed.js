exports.names = ['.mostplayed'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, playcount FROM (SELECT songid, count(*) as playcount FROM PLAYS GROUP BY songid ORDER BY count(*) DESC LIMIT 5) a INNER JOIN SONGS ON a.songid = SONGS.id', function (error, rows) {
    //    bot.sendChat('Songs played the most: ' + rows.map(function (row) {
    //        return row['author'] + ' - ' + row['title'] + ' (' + row['playcount'] + 'x)';
    //    }).join(' • '));
    //});
};

