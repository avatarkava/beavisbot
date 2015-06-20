exports.names = ['.help', '.support'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    if (config.slack.webhookUrl !== '') {
        bot.sendChat('Need help? Ask someone on staff or a resident DJ (names in purple). No mods around? Try .callmod or contact a Brand Ambassador in http://plug.dj/support @staff @rdjs');
    }
    else {
        bot.sendChat('Need help? Mention someone on staff or a resident DJ (names in purple). No mods around? Contact a Brand Ambassador in http://plug.dj/support @staff @rdjs');
    }

}