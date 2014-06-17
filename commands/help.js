exports.names = ['.help', '.support'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('Need help? Ask a mod! No mods around? Contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
};