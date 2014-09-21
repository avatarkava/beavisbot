exports.names = ['.mystats'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    // First, get ranking of user
    // I really hope there's an easier way to do this...
    //db.all('SELECT userid FROM PLAYS GROUP BY userid ORDER BY sum(upvotes) DESC', function (err, rows) {
    //    rank = _.pluck(rows, 'userid').indexOf(data.from.id.toString()) + 1;
    //    if (rank == 0) {
    //        bot.sendChat('You haven\'t played any songs in this room!');
    //    } else {
    //        db.get('SELECT count(*) as total, sum(upvotes) as up, avg(upvotes) as avg_up, sum(downvotes) as down, avg(downvotes) as avg_down, sum(snags) AS snag, avg(snags) AS avg_snag FROM PLAYS WHERE userid = ?', [data.from.id], function (error, row) {
    //            bot.sendChat(data.from.username + ', you have played ' + row['total'] + ' songs in this room with a total of ' + row['up'] + ' woots, ' + row['snag'] + ' grabs and ' + row['down'] + ' mehs (avg +' + row['avg_up'].toFixed(1) + '/' + row['avg_snag'].toFixed(1) + '/-' + row['avg_down'].toFixed(1) + ') • Rank: ' + rank + '/' + rows.length);
    //        });
    //    }
    //});
};
