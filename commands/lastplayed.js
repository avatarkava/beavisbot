exports.names = ['lastplayed'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    var message = '';

    var media = bot.getMedia();
    var songid = media.cid;

    if (params.length > 0) {
        songid = params.join(' ').trim();
    }

    attemptPurchase(data.from, 1, function (success) {
        if (success == true) {
            models.Play.findOne({
                include: [{
                    model: models.Song,
                    where: {$and: [{site: config.site}, {host: media.format}, {host_id: songid}]}
                }, models.User],
                order: [['created_at', 'DESC']]
            }).then(function (row) {
                if (!row && params.length == 0) {
                    chat('This is the first time I have seen this video played!');
                } else if (!row) {
                    chat('I have not seen a song with id `' + songid + '` played.');
                } else {
                    message = row.Song.name + ' • last played ' + timeSince(row.created_at) + ' by ' + row.User.username
                        + ' • ' + row.listeners + ' :ear: • ' + row.positive + ' :+1: • ' + row.grabs + ' :star: • ' + row.negative + ' :-1:';
                    chat(message);
                }
            });
        }
    });
};