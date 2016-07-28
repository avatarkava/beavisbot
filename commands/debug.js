exports.names = ['debug'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var debugData = null;

    console.log('[DEBUG] ' + JSON.stringify(data, null, 2));

    switch (input[1]) {
        case 'admins':
            debugData = bot.getAdmins();
            break;
        case 'ambassadors':
            debugData = bot.getAmbassadors();
            break;
        case 'audience':
            debugData = bot.getAudience();
            break;
        case 'dj':
            debugData = bot.getDJ();
            break;
        case 'djs':
            debugData = bot.getDJs();
            break;
        case 'host':
            debugData = bot.getHost();
            break;
        case 'media':
            debugData = bot.getMedia();
            break;
        case 'roomScore':
            debugData = bot.getRoomScore();
            break;
        case 'self':
            debugData = bot.getSelf();
            break;
        case 'staff':
            debugData = bot.getStaff();
            break;
        case 'timeElapsed':
            debugData = bot.getTimeElapsed();
            break;
        case 'timeRemaining':
            debugData = bot.getTimeRemaining();
            break;
        case 'user':
            debugData = bot.getUser(input[2]);
            break;
        case 'waitList':
            debugData = bot.getWaitList();
            break;
        case 'waitListPosition':
            debugData = bot.getWaitListPosition(parseInt(input[2]));
            break;
        default:
            bot.sendChat('/me Command not supported.');
            return;
            break;
    }

    if (debugData !== null) {
        bot.sendChat('/me Debugging data logged to the console, @' + data.from.username + '...');
        console.log('[DEBUG] ', data.message + ': ' + JSON.stringify(debugData, null, 2));
    } else {
        console.log('[DEBUG] ', data.message + ': null returned');
    }

};

