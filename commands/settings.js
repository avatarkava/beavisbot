exports.names = ['settings', 'set'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.BOUNCER_PLUS;
exports.handler = function (data) {

    var input = data.message.split(' ');
    // Settings to support direct access to
    supported = ['activeDJTimeoutMins',
        'minActiveDJQueueLength',
        'maxSongLengthSecs',
        'chatRandomnessPercentage',
        'quietMode',
        'upvoteSongs',
        'verboseLogging',
        'welcomeUsers'
    ];

    var settings = [];
    var chatMessage = "";

    if (input.length < 3) {
        for (var key in config) {
            if (config.hasOwnProperty(key) && _.contains(supported, key)) {
                chatMessage += key + ': ' + config[key] + ', ';
            }
        }
        bot.sendChat('Current settings: ' + chatMessage);
    }
    else {
        var key = input[1];
        var value = _.rest(input, 2).join(' ');

        if (_.contains(supported, key)) {
            config[key] = value;
            bot.sendChat('/me set: ' + key + ' = ' + value + ' @djs');
        }
        else {
            bot.sendChat('/me unknown setting: ' + key);
        }
    }

};

