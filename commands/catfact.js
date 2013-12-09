// cat facts!

exports.names = ['.catfact', 'catfact', '.catfacts'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    db.get('SELECT fact from CATFACTS ORDER BY RANDOM() LIMIT 1', function(err, row) {
        bot.chat(row['fact']);
    })
};