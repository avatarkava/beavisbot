exports.names = ['lastplayed'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var params = _.rest(data.message.split(' '), 1);
    var message = '';

    var media = bot.getMedia();
    var songid = media.cid;

    if (params.length > 0) {
        songid = params.join(' ').trim();
    }

    models.Play.findOne({
        include: [{
            model: models.Song,
            where: {$and: [{site: config.site}, {host: media.format}, {host_id: songid}]}
        }, models.User],
        order: [['created_at', 'DESC']]
    }).then(function (row) {
        if (!row && params.length == 0) {
            bot.sendChat('This is the first time I have seen this song played in this room!');
        } else if (!row) {
            bot.sendChat('I have not seen a song with id `' + songid + '` played in this room!');
        } else {
            message = row.Song.name + ' • last played ' + timeSince(row.created_at) + ' by ' + row.User.username
                + ' • ' + row.listeners + ' :ear: • ' + row.positive + ' :+1: • ' + row.grabs + ' :star: • ' + row.negative + ' :-1:';
            bot.sendChat(message);
        }
    });
};