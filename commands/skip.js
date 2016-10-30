exports.names = ['skip', 'skipban', 'skipbroken', 'skipnsfw', 'skipoor', 'skiptroll', 'blacklist'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {

    var dj = bot.getDJ();
    var media = bot.getMedia();

    if (dj == null) {
        return;
    }

    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input, 1);

    var message = '';
    var reason = '';
    var notes = '';

    var addToBlacklist = false;
    var banUser = false;

    if (params.length > 0) {
        notes = params.join(' ').trim();
    }

    if (media) {

        switch (command) {
            case 'blacklist':
                reason = '';
                addToBlacklist = true;
                banUser = false;
                break;
            case 'skipban':
                reason = '';
                addToBlacklist = true;
                banUser = true;
                break;
            case 'skipbroken':
                reason = 'Video broken/removed';
                addToBlacklist = true;
                banUser = false;
                break;
            case 'skipnsfw':
                reason = 'NSFW/Nudity';
                addToBlacklist = true;
                banUser = false;
                break;
            case 'skiptroll':
                reason = 'Troll/Not Music';
                addToBlacklist = true;
                banUser = false;
                break;
            case 'skipoor':
                reason = 'Out of range for theme';
                addToBlacklist = false;
                banUser = false;
                break;
            default:
                reason = '';
                addToBlacklist = false;
                banUser = false;
                break;
        }

        // Blacklist this song
        if (addToBlacklist && params.length == 0) {
            models.Song.update({is_banned: 1, banned_reason: reason}, {where: {host_id: media.cid}});
            bot.sendChat("The song \"" + media.name + "\" has been blacklisted.");
            message = '[BLACKLIST] ' + data.from.username + ' blacklisted ' + media.name + ' (ID:' + media.cid + ')';
        } else if (addToBlacklist) {
            blacklistSongById(notes, data.from);
            return;
        } else if (command == 'skipoor' && params.length > 0) {
            if (notes.match(/\d{4}$/)) {
                var releaseDate = notes + '-01-01';
                models.Song.update({release_date: releaseDate}, {where: {host_id: media.cid}});
            }
            bot.sendChat("The song \"" + media.name + "\" has been marked out of range (released in " + notes + ").");
            message = '[SKIP] ' + data.from.username + ' skipped a song.';

        } else {
            message = '[SKIP] ' + data.from.username + ' skipped a song.';
        }

        if (reason != '') {
            message += ' Reason: ' + reason;
        }
        if (notes != '') {
            message += ' Notes: ' + notes;
        }

        if (message != '') {
            console.log(message + ' ' + JSON.stringify(data, null, 2));
            sendToSlack(message);
        }

        bot.moderateForceSkip();

        if (banUser) {
            bot.moderateBanUser(dj.id, PlugAPI.BAN_REASON.OFFENSIVE_MEDIA, PlugAPI.BAN.PERMA);
        }

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

