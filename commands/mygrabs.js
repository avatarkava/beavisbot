exports.names = ['.mygrabs'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    db.get('SELECT SUM(snags) AS hearts FROM PLAYS WHERE userid = ?', [data.fromID], function (error, row) {
        bot.sendChat(data.from + ', you have grabbed ' + row['hearts'] + ' songs in this room!');
    });
};