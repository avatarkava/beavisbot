exports.names = ['catfact', 'catfacts'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    request('http://catfacts-api.appspot.com/api/facts', function (error, response, body) {
        if(body != null) {
            bot.sendChat(JSON.parse(body).facts[0]);
        }
    });
};