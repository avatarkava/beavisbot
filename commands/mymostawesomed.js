exports.names = ['.mymostwooted', '.mymostawesomed', 'mymostawesomed'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT author, title, sum_up FROM (SELECT songid, sum(upvotes) as sum_up FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY sum(upvotes) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.fromID], function(error, rows) {
        if (rows.length > 0) {
            bot.chat('The most wooted songs I\'ve heard from you: ' + rows.map(function(row) { return row['title'] + ' by ' + row['author'] + ': ' + row['sum_up'] + ' woots'; }).join(' · '));
        } else {
            bot.chat('You haven\'t played anything in this room!');
        }
    });
};

