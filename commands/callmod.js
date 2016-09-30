exports.names = ['callmod'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 300;
exports.cdUser = 300;
exports.cdStaff = 180;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var message = data.message.split(' ').slice(1).join(' ').trim();

    if (config.slack.webhookUrl === '') {
        bot.sendChat('Need help? Ask a staff member!');
    }
    else if(message === '') {
        bot.sendChat('Need help? Type ' + config.commandLiteral + 'callmod with the nature of your request - for example `' + config.commandLiteral + 'callmod Someone is spamming the chat!` You can also use /sos to contact a Plug Brand Ambassador. Please only use this for emergencies.');
    }
    else {
        if (sendToSlack('@channel - ' + data.from.username + ' requested help in https://plug.dj/' + config.roomName + " \n`" + message + "`")) {
            bot.sendChat('A mod has been contacted and will be on the way if available, @' + data.from.username + '. @staff');
        }
    }
}