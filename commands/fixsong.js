exports.names = ['.fixsong'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = true;
exports.handler = function (data) {
    function checkEchoNest(valueToCorrect) {
        request('http://developer.echonest.com/api/v4/song/search?api_key=' + config.apiKeys.echoNest + '&format=json&results=1&combined=' + S(valueToCorrect).escapeHTML().stripPunctuation().s, function (error, response, body) {
            logger.info('echonest body', body);
            if (error) {
                bot.sendChat('An error occurred while connecting to EchoNest.');
                logger.error('EchoNest error', error);
            } else {
                response = JSON.parse(body).response;

                bot.getMedia().suggested = {
                    author: response.songs[0].artist_name,
                    title: response.songs[0].title
                };
                bot.sendChat('Suggested Artist: "' + bot.getMedia().suggested.author + '". Title: "' + bot.getMedia().suggested.title + '". Type ".fixsong yes" to use the suggested tags.');
            }
        });
    }

    if (config.apiKeys.echoNest == null || config.apiKeys.echoNest == '###') {
        bot.sendChat('A valid EchoNest API key is needed to run this command.');
        return;
    }

    var input = data.message.split(' ');

    if (data.from.role > 1 || (data.from.id == bot.getMedia().currentDJ && input[1] != 'yes')) {
        bot.sendChat('This command is only available to bouncers, managers, and hosts.');
        return;
    }

    if (input[1] == 'yes') {
        // commit suggested song value to DB and room.media
        if (bot.getMedia().suggested) {
            bot.getMedia().author = bot.getMedia().suggested.author;
            bot.getMedia().title = bot.getMedia().suggested.title;
            //db.run('INSERT OR REPLACE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [bot.getMedia().id, bot.getMedia().title, bot.getMedia().format, bot.getMedia().author, bot.getMedia().cid, bot.getMedia().duration]);
            bot.sendChat('Database updated with corrected values.');
        } else {
            bot.sendChat('No suggested values present.');
        }
    } else if (input[1] == 'artist') {
        // commit corrected artist value to DB and room.media
        var artist = _.rest(input, 2).join(' ');
        bot.getMedia().author = artist;
        //db.run('INSERT OR REPLACE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [bot.getMedia().id, bot.getMedia().title, bot.getMedia().format, bot.getMedia().author, bot.getMedia().cid, bot.getMedia().duration],
        //    function (error) {
        //        if (error) {
        //            bot.sendChat('An error occurred.');
        //            logger.error('Error while updating song ' + bot.getMedia().id, error);
        //        } else {
        //            bot.sendChat('Author updated.')
        //        }
        //    });
    } else if (input[1] == 'title') {
        // commit corrected title value to DB and room.media
        var title = _.rest(input, 2).join(' ');
        bot.getMedia().title = title;
        //db.run('INSERT OR REPLACE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [bot.getMedia().id, bot.getMedia().title, bot.getMedia().format, bot.getMedia().author, bot.getMedia().cid, bot.getMedia().duration],
        //    function (error) {
        //        if (error) {
        //            bot.sendChat('An error occurred.');
        //            logger.error('Error while updating song ' + bot.getMedia().id, error);
        //        } else {
        //            bot.sendChat('Title updated.')
        //        }
        //    });
    } else if (input[1] == 'check') {
        // search echonest
        checkEchoNest(bot.getMedia().author + ' ' + bot.getMedia().title);
    } else {
        // first, search db
        //db.get('SELECT author, title FROM SONGS WHERE id = ?', [bot.getMedia().id],
        //    function (error, row) {
        //        logger.info('db response: ', row);
        //        if (row != null) {
        //            bot.sendChat('Database values: Artist: "' + row['author'] + '". Title: "' + row['title'] + '". Use .fixsong check if this looks wrong.');
        //        } else {
        //            // check echonest
        //            logger.info('checking echonest');
        //            checkEchoNest(bot.getMedia().author + ' ' + bot.getMedia().title);
        //        }
        //    });
    }
}
