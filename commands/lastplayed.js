exports.names = ['.lastplayed', 'lastplayed'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.get('SELECT username, started, upvotes, downvotes, snags FROM (SELECT userid, started, upvotes, downvotes, snags FROM PLAYS WHERE songid = "?" ORDER BY started DESC LIMIT 1) a INNER JOIN USERS ON a.userid = USERS.userid', [room.media.id], function(error, row) {
        if (row != null) {
            bot.chat('This song was last played on ' + row['started'] + ' by ' + row['username'] + '(+' + row['upvotes'] + '/-' + row['downvotes'] + ')');
        } else {
            bot.chat('This is the first time this song has been played in here.');
        }
    });
};