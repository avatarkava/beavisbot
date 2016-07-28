exports.names = ['define'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
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
                    bot.sendChat(definition[0].word + " [" + definition[0].partOfSpeech + "] - " + definition[0].text);
                }
            }
        });
    }
};