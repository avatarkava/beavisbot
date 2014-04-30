exports.names = ['.mostmehed', '.mostmehd'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    db.all('SELECT author, title, sum_down FROM (SELECT songid, sum(downvotes) as sum_down FROM PLAYS GROUP BY songid ORDER BY sum(downvotes) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', function (error, rows) {
        if (rows != null) {
            bot.sendChat('The most mehed songs I\'ve heard: ' + rows.map(function (row) {
                return row['title'] + ' by ' + row['author'] + ': ' + row['sum_down'] + ' lames.';
            }).join(' · '));
        } else {
            bot.sendChat('No one has mehed anything in this room!');
        }
    });
};

