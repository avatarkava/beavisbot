exports.names = ['.mostwooted', '.mostawesomed', 'mostawesomed'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT author, title, sum_up FROM (SELECT songid, sum(upvotes) as sum_up FROM PLAYS GROUP BY songid ORDER BY sum(upvotes) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', function(error, rows) {
        if (rows != null) {
            bot.chat('The most wooted songs I\'ve heard: ' + rows.map(function(row) { return row['title'] + ' by ' + row['author'] + ': ' + row['sum_up'] + ' woots'; }).join(' · '));
        } else {
            bot.chat('No one has wooted anything in this room!');
        }
    });
};

