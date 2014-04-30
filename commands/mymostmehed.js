exports.names = ['.mymostmehed'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    db.all('SELECT author, title, sum_down FROM (SELECT songid, sum(downvotes) as sum_down FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY sum(downvotes) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.fromID], function (error, rows) {
        if (rows.length > 0) {
            bot.sendChat('The worst songs I\'ve heard from you: ' + rows.map(function (row) {
                return row['title'] + ' by ' + row['author'] + ': ' + row['sum_down'] + ' mehs';
            }).join(' · '));
        } else {
            bot.sendChat('You haven\'t played anything in this room!');
        }
    });
};

