exports.names = ['.mostplayed', 'mostplayed'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT author, title, playcount FROM (SELECT songid, count(*) as playcount FROM PLAYS GROUP BY songid ORDER BY count(*) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', function(error, rows) {
        bot.chat('The songs I\'ve heard the most: ' + rows.map(function(row) { return row['title'] + ' by ' + row['author'] + ': ' + row['playcount'] + ' plays.'; }).join(' · '));
    });
};

