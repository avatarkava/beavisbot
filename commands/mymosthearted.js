exports.names = ['.mymosthearted', '.mymostsnagged', 'mymostsnagged', '.mymostcurated'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT author, title, sum_hearts FROM (SELECT songid, sum(snags) as sum_hearts FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY sum(snags) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.fromID], function(error, rows) {
        if (rows != null) {
            bot.chat('The most hearted songs I\'ve heard from you: ' + rows.map(function(row) { return row['title'] + ' by ' + row['author'] + ': ' + row['sum_hearts'] + ' hearts'; }).join(' · '));
        } else {
            bot.chat('You haven\'t played anything in this room!');
        }
    });
};

