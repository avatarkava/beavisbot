// scott pilgrim quotes!

exports.names = ['.pilgrim', 'one two three four', 'pilgrim'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.get('SELECT quote from SCOTT_PILGRIM ORDER BY RANDOM() LIMIT 1', function(err, row) {
        bot.chat(row['quote']);
    })
};