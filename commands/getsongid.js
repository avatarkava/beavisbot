exports.names = ['.getsongid'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    var searchString = '%' + data.message.substring(11) + '%';
    
    db.all('SELECT author, title, id FROM SONGS WHERE title LIKE ? OR author LIKE ? LIMIT 5', [searchString, searchString], function(err, rows) {
        if (rows != null && rows.length > 0) {
            bot.chat('Possible matches: ' + _.map(rows, function(row) { return row['id'] + ' (' + row['author'] + ' - ' + row['title'] + ')'; }).join(' · '));
        } else {
            bot.chat('No matches found.');
        }
    });
};
