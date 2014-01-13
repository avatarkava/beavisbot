exports.names = ['.mygrabs', '.myhearts', 'myhearts'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    db.get('SELECT SUM(snags) AS hearts FROM PLAYS WHERE userid = ?', [data.fromID], function (error, row) {
        bot.chat(data.from + ', you have ' + row['hearts'] + ' grabs in this room!');
    });
};