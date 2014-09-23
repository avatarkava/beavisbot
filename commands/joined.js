exports.names = ['.joined']
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    if (params.length < 1) {
        bot.sendChat(data.from.username + ' joined ' + timeSince(data.from.joined));
        return;
    }

    username = params.join(' ').trim()
    usernameFormatted = S(username).chompLeft('@').s;


    User.find({where: {username: usernameFormatted}}).on('success', function (row) {
        if (row === null) {
            bot.sendChat(usernameFormatted + ' was not found.');
        } else {
            bot.sendChat(row.username + ' joined ' + timeSince(row.joined));
        }
    });


};