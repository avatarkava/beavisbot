exports.names = ['.pilgrim'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    db.get('SELECT quote from SCOTT_PILGRIM ORDER BY RANDOM() LIMIT 1', function (err, row) {
        bot.sendChat(row['quote']);
    })
};