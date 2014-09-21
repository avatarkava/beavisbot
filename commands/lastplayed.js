exports.names = ['.lastplayed'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    //db.get('SELECT username, started, upvotes, downvotes, snags FROM (SELECT userid, started, upvotes, downvotes, snags FROM PLAYS WHERE songid = ? AND strftime("%s", datetime("now")) - strftime("%s", started) > 600 ORDER BY started DESC LIMIT 1) a INNER JOIN USERS ON a.userid = USERS.userid', [bot.getMedia().id], function (error, row) {
    //    if (row != null) {
    //        bot.sendChat('This song was last played ' + timeSince(row['started']) + ' by ' + row['username'] + ' (+' + row['upvotes'] + '/' + row['snags'] + '/-' + row['downvotes'] + ')');
    //    } else {
    //        bot.sendChat('This is the first time this song has been played in here.');
    //    }
    //});
};