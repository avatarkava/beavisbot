exports.names = ['skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {

    var dj = bot.getDJ();

    if (data.user.id == dj.id || bot.hasPermission(bot.getUser(data.user.id), 'skip')) {

        var media = bot.getMedia();
        console.log('[SKIP] ' + data.user.username + ' skipped ' + dj.username + ' - ' + media.name + ' (' + media.id + ')');
        if (data.user.id !== dj.id) {
            var userData = {
                type: 'skip',
                details: media.id + ': ' + media.name + ' (skipped by ' + data.user.username + ')',
                user_id: dj.id,
                mod_user_id: data.user.id
            };
            Karma.create(userData);
        }

        bot.moderateSkip();
    }
};

