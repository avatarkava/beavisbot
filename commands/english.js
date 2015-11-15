exports.names = ['english'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = true;
exports.handler = function (data) {

    if (data.from.role >= 1) {
        var params = _.rest(data.message.split(' '), 1);

        if (params.length < 1) {
            bot.sendChat(config.responses.language);
        }
        else {

            username = params.join(' ').trim()
            usernameFormatted = S(username).chompLeft('@').s;

            // @TODO - Maybe provide language-specific messages to users
            var user = _.findWhere(bot.getUsers(), {username: usernameFormatted});
            bot.sendChat('@' + usernameFormatted + ': ' + config.responses.language);
        }
    }

};