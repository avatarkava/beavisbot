exports.names = ['.help', '.support'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    if (config.slack.webhookUrl !== '') {
        bot.sendChat('Need help? Mention @staff. No mods around? Try .callmod or contact a Brand Ambassador in http://plug.dj/support');
    }
    else {
        bot.sendChat('Need help? Mention @staff. No mods around? Contact a Brand Ambassador in http://plug.dj/support');
    }

}