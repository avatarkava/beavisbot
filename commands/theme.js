exports.names = ['.theme'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');

    RoomEvent.find({where: {type: 'theme', starts_at: {lte: moment.utc().add(1, 'day').toDate()}, ends_at: {gte: new Date()}}}).on('success', function (row) {
        if (row === null) {
            bot.sendChat('/me ' + config.responses.theme);
        } else {
            if (row.starts_at >= moment.utc().toDate()) {
                row.details = timeUntil(row.starts_at) + ' ' + row.details;
            }
            bot.sendChat('/me ' + row.title + ' - ' + row.details);
        }
    });

};