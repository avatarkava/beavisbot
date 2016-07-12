exports.names = ['debug'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (data.from.username == config.superAdmin) {

        var input = data.message.split(' ');

        switch (input[1]) {
            case 'admins':
                data = bot.getAdmins();
                break;
            case 'ambassadors':
                data = bot.getAmbassadors();
                break;
            case 'audience':
                data = bot.getAudience();
                break;
            case 'dj':
                data = bot.getDJ();
                break;
            case 'djs':
                data = bot.getDJs();
                break;
            case 'host':
                data = bot.getHost();
                break;
            case 'media':
                data = bot.getMedia();
                break;
            case 'roomScore':
                data = bot.getRoomScore();
                break;
            case 'self':
                data = bot.getSelf();
                break;
            case 'staff':
                data = bot.getStaff();
                break;
            case 'timeElapsed':
                data = bot.getTimeElapsed();
                break;
            case 'timeRemaining':
                data = bot.getTimeRemaining();
                break;
            case 'user':
                data = bot.getUser(input[2]);
                break;
            case 'waitList':
                data = bot.getWaitList();
                break;
            case 'waitListPosition':
                data = bot.getWaitListPosition(input[2]);
                break;
            default:
                bot.sendChat('/me Command not supported.');
                return;
                break;
        }

        bot.sendChat('/me Debugging data logged to the console, @' + data.from.username + '...');
        console.log('[DEBUG] ', data.message + ': ' + JSON.stringify(data, null, 2));
    }
};

