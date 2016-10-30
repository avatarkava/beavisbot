module.exports = function (bot) {

    blacklistSongById = function (songid, from) {
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
                    mod_user_id: from.db.id
                };
                models.Karma.create(userData);
                models.Song.update({is_banned: 1}, {where: {host_id: songid}});
                bot.sendChat("The song \"" + row.Song.name + "\" has been blacklisted.");
                message = '[BLACKLIST] ' + from.username + ' blacklisted ' + row.Song.name + ' (ID:' + row.Song.host_id + ')';
                console.log(message);
                sendToSlack(message);
            }
        });
    };

    monitorDJList = function () {

    };

    removeIfDownvoting = function (mehUsername) {

        var mehWaitList = bot.getWaitList();
        var mehUser = findUserInList(mehWaitList, mehUsername);

        if (config.verboseLogging) {
            console.log('[WAITLIST]' + JSON.stringify(mehWaitList, null, 2));
        }

        if (mehUser !== undefined && mehUser.vote == -1) {
            console.log('[REMOVE] Removed ' + mehUser.username + ' from wait list for mehing');
            var position = bot.getWaitListPosition(mehUser.id);
            bot.moderateRemoveDJ(mehUser.id);
            bot.sendChat('@' + mehUser.username + ', voting MEH/Chato/:thumbsdown: while in line is prohibited. Check .rules.');
            getDbUserFromSiteUser(mehUser.id, function (row) {
                var userData = {
                    type: 'remove',
                    details: 'Removed from position ' + position + ' for mehing',
                    user_id: row.id,
                    mod_user_id: botUser.db.id
                };
                models.Karma.create(userData);
            });
        }
    };
};