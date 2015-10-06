exports.names = ['catfact', 'catfacts'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    request('http://catfacts-api.appspot.com/api/facts', function (error, response, body) {
        bot.chat(JSON.parse(body).facts[0]);
    });
};