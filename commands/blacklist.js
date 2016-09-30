exports.names = ['blacklist'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.BOUNCER;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    var dj = bot.getDJ();
    var message = '';

    if (dj == null) {
        return;
    }

    if (params.length > 0) {
        songid = params.join(' ').trim();
        models.Play.findOne({
            include: [{
                model: models.Song,
                where: {$and: [{site: config.site}, {host_id: songid}]}
            }, models.User],
            order: [['created_at', 'DESC']]
        }).then(function (row) {
            if (!row) {
                bot.sendChat('I have not seen a song with id `' + songid + '` played in this room!');
            } else {
                var userData = {
                    type: 'blacklist',
                    details: 'Blacklisted ' + row.Song.name + ' (spun by ' + row.User.username + ')',
                    user_id: row.User.id,
                    mod_user_id: data.from.db.id
                };
                models.Karma.create(userData);
                models.Song.update({is_banned: 1}, {where: {host_id: songid}});
                bot.sendChat("The song \"" + row.Song.name + "\" has been blacklisted.");
                message = '[BLACKLIST] ' + data.from.username + ' blacklisted ' + row.Song.name;
                console.log(message);
                sendToSlack('@channel - ' + message);
            }
        });
    }
    else {
        var media = bot.getMedia();
        var songid = media.cid;
        models.Song.update({is_banned: 1}, {where: {site_id: media.id}});
        bot.sendChat("The song \"" + media.name + "\" has been blacklisted.");
        bot.moderateForceSkip();
        message = '[BLACKLIST] ' + data.from.username + ' blacklisted ' + media.title;
        console.log(message);
        sendToSlack('@channel - ' + message);
    }


};

