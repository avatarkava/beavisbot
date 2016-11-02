exports.names = ['fact'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    request('http://numbersapi.com/random/trivia', function (error, response, body) {
        if (!error && response.statusCode === 200 && body != null) {
            bot.sendChat(body);
        }
    });
};