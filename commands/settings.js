exports.names = ['settings', 'set'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 5;
exports.minRole = PERMISSIONS.BOUNCER_PLUS;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var logMessage = '';
    var chatMessage = '';
    var result;

    var translation = [
        { configName: 'djIdleAfterMins', chatName: 'djidle', english: 'DJ Idle Seconds', notify: true },
        {
            configName: 'djIdleMinQueueLengthToEnforce',
            chatName: 'minidlequeue',
            english: 'Min Idle Queue',
            notify: false
        },
        { configName: 'djCycleMaxQueueLength', chatName: 'maxcyclequeue', english: 'Max Cycle Queue', notify: false },
        { configName: 'maxSongLengthSecs', chatName: 'maxsonglength', english: 'Max Song Seconds', notify: true },
        { configName: 'minSongReleaseDate', chatName: 'minreleasedate', english: 'Min Release Date ', notify: true },
        { configName: 'maxSongReleaseDate', chatName: 'maxreleasedate', english: 'Max Release Date', notify: true },
        { configName: 'prohibitDownvoteInQueue', chatName: 'nomehsinqueue', english: 'No Mehs in Queue', notify: false },
        { configName: 'quietMode', chatName: 'quietmode', english: 'Quiet Mode', notify: false },
        { configName: 'verboseLogging', chatName: 'verboselogging', english: 'Verbose Logging', notify: false }
    ];

    if (input.length < 3) {
        for (var key in config.queue) {
            result = _.findWhere(translation, { configName: key });
            if (config.queue.hasOwnProperty(key) && result) {
                chatMessage += result.chatName + ': ' + config.queue[key] + ', ';
            }
        }
        for (var key in config) {
            result = _.findWhere(translation, { configName: key });
            if (config.hasOwnProperty(key) && result) {
                chatMessage += result.chatName + ': ' + config[key] + ', ';
            }
        }
        if (chatMessage != '') {
            bot.sendChat('Settings: ' + trimCommas(chatMessage));
        }
    }
    else {
        var setting = input[1];
        var newValue = _.rest(input, 2).join(' ').trim();
        result = _.findWhere(translation, { chatName: setting });

        if (result !== undefined) {

            if (newValue === 'false') {
                newValue = new Boolean(false);
            } else if (newValue === 'true') {
                newValue = new Boolean(true);
            } else if (newValue.match(/[^0-9+$]/)) {
                newValue = parseInt(newValue);
            }

            if (config.queue.hasOwnProperty(result.configName)) {
                config.queue[result.configName] = newValue;
            }
            if (config.hasOwnProperty(result.configName)) {
                config[result.configName] = newValue;
            }
            if (result.notify) {
                bot.sendChat(result.english + ' now set to: ' + newValue + ' @djs');
            }
            logMessage = '[CONFIG] ' + data.from.username + ' set `' + result.configName + '` to `' + newValue + '`';
            console.log(logMessage);
            sendToSlack(logMessage);
        }
        else {
            bot.sendChat('unknown setting: ' + setting);
        }

        // @TODO - need to merge down configState and settings{}
        settings.maxsonglength = parseInt(config.queue.maxSongLengthSecs);
        settings.maxdjidletime = parseInt(config.queue.djIdleAfterMins) * 60;
        settings.djidleminqueue = parseInt(config.queue.djIdleMinQueueLengthToEnforce);
        settings.djcyclemaxqueue = parseInt(config.queue.djCycleMaxQueueLength);

        writeConfigState();
    }

};

