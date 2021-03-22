exports.names = ['lastseen', 'seen'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var params = _.rest(data.text.split(' '), 1);
    if (params.length < 1) {
        bot.speak('usage: ' + config.commandLiteral + 'lastseen username');
        return;
    }

    username = params.join(' ').trim();
    usernameFormatted = S.ltrim(username, '@');

    models.User.findOne({where: {username: usernameFormatted}, order: [['updatedAt', 'DESC']]}).then(function (row) {        
        if (row === null) {
            bot.speak(usernameFormatted + ' was not found.');
        } else {
            var user = findUserInList(getUsers(), usernameFormatted);
            if (user) {
                bot.speak(user.username + ' is in the room and was last active ' + timeSince(row.last_active));
            }
            else {
                bot.speak(row.username + ' was last seen ' + timeSince(row.last_seen));
            }
        }
    });

};