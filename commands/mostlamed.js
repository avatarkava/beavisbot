exports.names = ['.mostlamed', 'mostlamed'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT author, title, sum_down FROM (SELECT songid, sum(downvotes) as sum_down FROM PLAYS GROUP BY songid ORDER BY sum(downvotes) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', function(error, rows) {
        if (rows != null) {
            bot.chat('The most lamed songs I\'ve heard: ' + rows.map(function(row) { return row['title'] + ' by ' + row['author'] + ': ' + row['sum_down'] + ' lames.'; }).join(' · '));
        } else {
            bot.chat('No one has lamed anything in this room!');
        }
    });
};

