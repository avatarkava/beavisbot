exports.names = ['catfact', 'catfacts'];
exports.hidden = true;
exports.enabled = false;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    // API is currently offline due to being written in Python 2.5, which is not supported by appspot
    // request('http://catfacts-api.appspot.com/api/facts', function (error, response, body) {
    //     if(body != null) {
    //         bot.sendChat(JSON.parse(body).facts[0]);
    //     }
    // });
};