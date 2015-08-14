exports.names = ['.skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if (data.from.role > 1 || data.from.id == bot.getDJ().id || (config.allowRDJSkip && data.from.role == 1)) {

        media = bot.getMedia();

        logger.warning('[SKIP] ' + data.from.username + ' skipped ' + bot.getDJ().username);

        if (data.from.id !== bot.getDJ().id) {
            var userData = {
                type: 'skip',
                details: 'Skipped by ' + data.from.username,
                user_id: bot.getDJ().id,
                mod_user_id: data.from.id
            };
            Karma.create(userData);
        }

        bot.moderateForceSkip();
        //bot.moderateDeleteChat(data.id);
    }
};

