exports.names = ['.mymostlamed', '.mymostmehd', 'mymostlamed'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT author, title, sum_down FROM (SELECT songid, sum(downvotes) as sum_down FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY sum(downvotes) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.fromID], function(error, rows) {
        if (rows.length > 0) {
            bot.chat('The most lamed songs I\'ve heard from you: ' + rows.map(function(row) { return row['title'] + ' by ' + row['author'] + ': ' + row['sum_down'] + ' lames'; }).join(' · '));
        } else {
            bot.chat('You haven\'t played anything in this room!');
        }
    });
};

