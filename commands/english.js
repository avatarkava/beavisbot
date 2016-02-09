exports.names = ['english'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (bot.hasPermission(bot.getUser(data.user.id), 'skip')) {
        var params = _.rest(data.message.split(' '), 1);
        if (params.length < 1) {
            bot.sendChat(config.responses.language);
        }
        else {
            username = params.join(' ').trim()
            usernameFormatted = S(username).chompLeft('@').s;

            // @TODO - Maybe provide language-specific messages to users
            // var user = bot.getUserByName(usernameFormatted, true);
            bot.sendChat('@' + usernameFormatted + ': ' + config.responses.language);
        }
    }

};