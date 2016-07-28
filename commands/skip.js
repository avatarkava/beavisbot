exports.names = ['skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 15;
exports.cdUser = 15;
exports.cdManager = 15;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {

    var dj = bot.getDJ();
    var media = bot.getMedia();

    if (dj == null) {
        return;
    }

    var params = _.rest(data.message.split(' '), 1);
    var message = '';

    if (params.length > 0) {
        message = params.join(' ').trim();
    }

    if (media) {
        console.log('[SKIP] ' + data.from.username + ' skipped ' + dj.username + ' - ' + media.name + ' (' + media.id + '): ' + message);
        bot.moderateForceSkip();

        getDbUserFromSiteUser(dj, function (row) {
            var userData = {
                type: 'skip',
                details: media.id + ': ' + media.name + ' (skipped by ' + data.from.username + '): ' + message,
                user_id: row.id,
                mod_user_id: data.from.db.id
            };
            models.Karma.create(userData);
        });

    }
};

