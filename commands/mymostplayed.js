exports.names = ['.mymostplayed', 'mymostplayed'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.all('SELECT author, title, playcount FROM (SELECT songid, count(*) as playcount FROM PLAYS WHERE userid = ? GROUP BY songid ORDER BY count(*) DESC LIMIT 3) a INNER JOIN SONGS ON a.songid = SONGS.id', [data.fromID], function(error, rows) {
        if (rows.length > 0) {
            bot.chat('The songs I\'ve heard the most from you: ' + rows.map(function(row) { return row['title'] + ' by ' + row['author'] + ': ' + row['playcount'] + (row['playcount'] > 1 ? ' plays' : ' play'); }).join(' · '));
        } else {
            bot.chat('You haven\'t played anything in this room!');
        }
    });      
};

