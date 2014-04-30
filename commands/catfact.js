// cat facts!
exports.names = ['.catfact', '.catfacts'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    db.get('SELECT fact from FACTS WHERE category = ? ORDER BY RANDOM() LIMIT 1', ['cat'], function (err, row) {
        bot.sendChat(row['fact']);
    })
};