exports.names = ['.mymostplayed'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, playcount FROM (SELECT songid, count(*) as playcount FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY count(*) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.from.id], function (error, rows) {
    //    if (rows.length > 0) {
    //        bot.sendChat("Songs you've played the most: " + rows.map(function (row) {
    //            return row['author'] + ' - ' + row['title'] + ' (' + row['playcount'] + 'x)';
    //        }).join(' • '));
    //    } else {
    //        bot.sendChat("You haven't played anything in this room!");
    //    }
    //});
};

