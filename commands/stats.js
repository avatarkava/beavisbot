exports.names = ['.stats', 'stats'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.get('SELECT COUNT(*) AS total_songs, COUNT(DISTINCT userid) AS total_djs, COUNT(DISTINCT songid) AS unique_songs, SUM(upvotes) AS upvotes, SUM(downvotes) AS downvotes, AVG(upvotes) as avg_upvotes, AVG(downvotes) as avg_downvotes FROM PLAYS', function(err, row) {
        bot.chat('In this room, ' + row['total_songs'] + ' songs ('
            + row['unique_songs'] + ' unique) have been played by '
            + row['total_djs'] + ' DJs with a total of '
            + row['upvotes'] + ' woots and '
            + row['downvotes'] + ' mehs (avg +'
            + new Number(row['avg_upvotes']).toFixed(1) + '/-'
            + new Number(row['avg_downvotes']).toFixed(1) + ').');
    });
};
