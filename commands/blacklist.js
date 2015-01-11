exports.names = ['.blacklist'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1) {

        media = bot.getMedia();

        logger.warning('[BLACKLIST] ' + data.from.username + ' blacklisted ' + media.title);

        var userData = {
            type: 'blacklist',
            details: 'Blacklisted ' + media.title + ' CID ' + media.id + ' by ' + data.from.username,
            user_id: bot.getDJ().id,
            mod_user_id: data.from.id
        };
        Karma.create(userData);

        Song.update({is_banned: 1}, {where: {id: media.id}});
        bot.sendChat("The song " + media.title + " has been blacklisted.");

        bot.moderateForceSkip();
        //bot.moderateDeleteChat(data.id);
    }
};

