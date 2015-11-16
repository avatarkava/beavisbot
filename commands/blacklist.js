exports.names = ['blacklist'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {
    if (bot.hasPermission(bot.getUser(data.user.id), 'queue-order')) {

        media = bot.getMedia();
        console.log('[BLACKLIST] ' + data.from.username + ' blacklisted ' + media.title);

        getDbUserFromSiteUser(bot.getDJ().id, function (row) {
            var userData = {
                type: 'blacklist',
                details: 'Blacklisted ' + media.name + ' (spun by ' + data.user.username + ')',
                user_id: row.id,
                mod_user_id: data.user.db.id
            };
            models.Karma.create(userData);
        });

        models.Song.update({is_banned: 1}, {where: {site_id: media.id}});
        bot.sendChat("The song " + media.name + " has been blacklisted.");

        bot.moderateForceSkip();
    }
};

