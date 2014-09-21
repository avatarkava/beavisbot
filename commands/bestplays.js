// best plays

exports.names = ['.bestplays'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.all('SELECT author, title, upvotes FROM (SELECT songid, upvotes FROM PLAYS ORDER BY upvotes DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', function (error, rows) {
    //    bot.sendChat('Plays with the most woots: ' + rows.map(function (row) {
    //        return row['author'] + ' - ' + row['title'] + ' (+' + row['upvotes'] + ')';
    //    }).join(' • '));
    //});
};