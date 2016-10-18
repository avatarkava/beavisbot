exports.names = ['today'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    var factApi = 'http://numbersapi.com/' + month + '/' + day;
    request(factApi, function (error, response, body) {
        var result = 'Bad request to facts...';
        if (!error && response.statusCode === 200) {
            result = body;
        }
        bot.sendChat(result);
    });
};