exports.names = ['.mystats', 'mystats'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    // First, get ranking of user
    // I really hope there's an easier way to do this...
    db.all('SELECT userid FROM PLAYS GROUP BY userid ORDER BY count(*) DESC', function(err, rows) {
        rank = _.pluck(rows, 'userid').indexOf(data.fromID) + 1;
        if (rank == 0) {
            bot.chat('You haven\'t played any songs in this room!');
        } else {
            db.get('SELECT count(*) as total, sum(upvotes) as up, avg(upvotes) as avg_up, sum(downvotes) as down, avg(downvotes) as avg_down FROM PLAYS WHERE userid = ?', [data.fromID], function(error, row) {
                bot.chat(data.from + ', you have played ' + row['total'] + ' songs in this room with a total of ' + row['up'] + ' woots and ' + row['down'] + ' mehs (avg +' + row['avg_up'].toFixed(1) + '/-' + row['avg_down'].toFixed(1) + ') (Rank: ' + rank + '/' + rows.length + ')');
            });
        }
    });
};
