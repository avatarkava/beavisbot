exports.names = ['.fixsong'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    function checkEchoNest(valueToCorrect) {
        request('http://developer.echonest.com/api/v4/song/search?api_key=' + config.apiKeys.echoNest + '&format=json&results=1&combined=' + S(valueToCorrect).escapeHTML().stripPunctuation().s, function(error, response, body) {
            console.log('echonest body', body);
            if (error) {
                bot.chat('An error occurred while connecting to EchoNest.');
                console.log('EchoNest error', error);
            } else {
                response = JSON.parse(body).response;
                
                room.media.suggested = {
                    author: response.songs[0].artist_name,
                    title: response.songs[0].title
                };
                bot.chat('Suggested Artist: "' + room.media.suggested.author + '". Title: "' + room.media.suggested.title + '". Type ".fixsong yes" to use the suggested tags.');
            }
        });
    }
    
    if (config.apiKeys.echoNest == null || config.apiKeys.echoNest == '###') {
        bot.chat('A valid EchoNest API key is needed to run this command.');
        return;
    }
    
    var input = data.message.split(' ');
    
    if (room.staff[data.fromID] < 1 || (data.fromID == room.currentDJ && input[1] != 'yes' && room.staff[data.fromID] < 1)) {
        bot.chat('This command is only available to bouncers, managers, and hosts.');
        return;
    } 
    
    if (input[1] == 'yes') {
        // commit suggested song value to DB and room.media
        if (room.media.suggested) {
            room.media.author = room.media.suggested.author;
            room.media.title = room.media.suggested.title;
            db.run('INSERT OR REPLACE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [room.media.id, room.media.title, room.media.format, room.media.author, room.media.cid, room.media.duration]);
            bot.chat('Database updated with corrected values.');
        } else {
            bot.chat('No suggested values present.');
        }
    } else if (input[1] == 'artist') {
        // commit corrected artist value to DB and room.media
        var artist = _.rest(input, 2).join(' ');
        room.media.author = artist;
        db.run('INSERT OR REPLACE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [room.media.id, room.media.title, room.media.format, room.media.author, room.media.cid, room.media.duration],
            function(error) {
                if (error) {
                    bot.chat('An error occurred.');
                    console.log('Error while updating song ' + room.media.id, error);
                } else {
                    bot.chat('Author updated.')
                }
        });
    } else if (input[1] == 'title') {
        // commit corrected title value to DB and room.media
        var title = _.rest(input, 2).join(' ');
        room.media.title = title;
        db.run('INSERT OR REPLACE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [room.media.id, room.media.title, room.media.format, room.media.author, room.media.cid, room.media.duration],
            function(error) {
            if (error) {
                bot.chat('An error occurred.');
                console.log('Error while updating song ' + room.media.id, error);
            } else {
                bot.chat('Title updated.')
            }
        });
    } else if (input[1] == 'check') {
        // search echonest
        checkEchoNest(room.media.author + ' ' + room.media.title);
    } else {
        // first, search db
        db.get('SELECT author, title FROM SONGS WHERE id = ?', [room.media.id],
            function(error, row) {
            console.log('db response: ', row);
            if (row != null) {
                bot.chat('Database values: Artist: "' + row['author'] + '". Title: "' + row['title'] + '". Use .fixsong check if this looks wrong.');
            } else {
                // check echonest
                console.log('checking echonest');
                checkEchoNest(room.media.author + ' ' + room.media.title);
            }
        });
    }
}
