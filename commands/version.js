// Version

exports.names = ['.version'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    request('http://registry.npmjs.org/sparklebot/latest', function(error, response, body) {
        var currentVersion = JSON.parse(body).version;
        if (package.version < currentVersion) {
            setTimeout(function() {
                bot.chat('Your version of sparklebot is out of date! Update through npm or at http://git.io/sparkle', 1000);
            });
        }
        bot.chat('[Sparkle] ' + package.version + ' (Latest version: ' + currentVersion + ')');
    })
};