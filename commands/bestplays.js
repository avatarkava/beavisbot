// best plays

exports.names = ['.bestplays', 'bestplays'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT author, title, upvotes FROM (SELECT songid, upvotes FROM PLAYS ORDER BY upvotes DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', function(error, rows) {
        bot.chat('The song plays I\'ve heard with the most woots: ' + rows.map(function(row) { return row['title'] + ' by ' + row['author'] + ': ' + row['upvotes'] + ' woots.'; }).join(' · '));
    });
};