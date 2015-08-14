exports.names = ['.define'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = _.rest(data.message.split(' '), 1).join(' ').trim();

    if (input.length > 0 && config.apiKeys.wordnik) {
        var uri = "http://api.wordnik.com:80/v4/word.json/" + input + "/definitions?limit=200&includeRelated=true&useCanonical=true&includeTags=false&api_key=" + config.apiKeys.wordnik;

        var request = require('request');
        request(uri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var definition = JSON.parse(body);
                if (definition.length == 0) {
                    bot.sendChat('No definition for ' + input + ' found.');
                } else {
                    bot.sendChat("[ " + definition[0].word.toUpperCase() + " ] " + definition[0].partOfSpeech + " &mdash; " + definition[0].text);
                }
            }
        });
    }
};