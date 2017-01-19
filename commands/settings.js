exports.names = ['settings', 'set'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 5;
exports.minRole = PERMISSIONS.BOUNCER_PLUS;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var chatMessage = '';
    var result;

    var translation = [
        {configName: 'djIdleAfterMins', chatName: 'djidle', english: 'DJ Idle Seconds'},
        {configName: 'djIdleMinQueueLengthToEnforce', chatName: 'minidlequeue', english: 'Min Idle Queue'},
        {configName: 'djCycleMaxQueueLength', chatName: 'maxcyclequeue', english: 'Max Cycle Queue'},
        {configName: 'maxSongLengthSecs', chatName: 'maxsonglength', english: 'Max Song Seconds'},
        {configName: 'minSongReleaseDate', chatName: 'minreleasedate', english: 'Min Release Date '},
        {configName: 'maxSongReleaseDate', chatName: 'maxreleasedate', english: 'Max Release Date'},
        {configName: 'prohibitDownvoteInQueue', chatName: 'nomehsinqueue', english: 'No Mehs in Queue'},
        {configName: 'quietMode', chatName: 'quietmode', english: 'Quiet Mode'},
        {configName: 'verboseLogging', chatName: 'verboselogging', english: 'Verbose Logging'}
    ];

    if (input.length < 3) {
        for (var key in config.queue) {
            result = _.findWhere(translation, {configName: key});
            if (config.queue.hasOwnProperty(key) && result) {
                chatMessage += result.chatName + ': ' + config.queue[key] + ', ';
            }
        }
        for (var key in config) {
            result = _.findWhere(translation, {configName: key});
            if (config.hasOwnProperty(key) && result) {
                chatMessage += result.chatName + ': ' + config[key] + ', ';
            }
        }
        if(chatMessage != '') {
            bot.sendChat('Settings: ' + trimCommas(chatMessage));
        }
    }
    else {
        var setting = input[1];
        var value = _.rest(input, 2).join(' ');
        var result = _.findWhere(translation, {chatName: setting});

        if (result !== undefined) {
            if (config.queue.hasOwnProperty(result.configName)) {
                config.queue[result.configName] = value;
            }
            if (config.hasOwnProperty(result.configName)) {
                config[result.configName] = value;
            }
            bot.sendChat(result.english + ' now set to: ' + value + ' @djs');
            console.log('[CONFIG]', data.from + ' set ' + result.configName + ' to ' + value);
        }
        else {
            bot.sendChat('unknown setting: ' + setting);
        }

        writeConfigState();
    }

};

