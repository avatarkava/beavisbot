exports.names = ['help', 'support'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    // @TODO - Use this to show all active staff - console.log(bot.getStaff());

    if (config.slack.webhookUrl !== '') {
        bot.sendChat('Need help? Ask a staff member. None around? Try ' + config.commandLiteral + 'callmod');
    }
    else {
        bot.sendChat('Need help? Ask a staff member.');
    }

}