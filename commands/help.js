exports.names = ['help', 'support'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 60;
exports.cdUser = 60;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    // @TODO - Use this to show all active staff - console.log(bot.getStaff());

    if (config.slack.webhookUrl !== '') {
        bot.sendChat('Need help? Ask a staff member. None around? Try ' + config.commandLiteral + 'callmod. @staff');
    }
    else {
        bot.sendChat('Need help? Ask a staff member. @staff');
    }

}