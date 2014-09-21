exports.names = ['.help', '.support'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    if (config.slack.webhookUrl !== '') {
        bot.sendChat('Need help? Ask a mod! No mods around? Use .callmod or contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
    }
    else {
        bot.sendChat('Need help? Ask a mod! No mods around? Contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
    }

}