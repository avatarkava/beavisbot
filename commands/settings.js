exports.names = ['.settings', '.set'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (data.from.role > 1) {

        var input = data.message.split(' ');
        // Settings to support direct access to
        supported = ['activeDJTimeoutMins',
            'allowRDJSkip',
            'maxSongLengthSecs',
            'prohibitMehInLine',
            'quietMode',
            'requireWootInLine',
            'verboseLogging',
            'welcomeUsers',
            'wootSongs'];

        var settings = [];
        var chatMessage = "";

        if (input.length < 3) {
            for (var key in config) {
                if (config.hasOwnProperty(key) && _.contains(supported, key)) {
                    chatMessage += key + ': ' + config[key] + ', ';
                }
            }
            bot.sendChat('/me Current settings: ' + chatMessage);
        }
        else {
            var key = input[1];
            var value = input[2];

            if (_.contains(supported, key)) {
                config[key] = value;
                bot.sendChat('/me @djs @staff - set: ' + key + ' = ' + value);
            }
            else {
                bot.sendChat('/me unknown setting: ' + key );
            }
        }
    }
};

