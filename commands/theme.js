exports.names = ['.theme'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');

    RoomEvent.findAll({
        where: {type: 'theme', starts_at: {lte: moment.utc().add(1, 'day').toDate()}, ends_at: {gte: new Date()}},
        order: [['starts_at', 'ASC']],
        limit: 3
    }).on('success', function (rows) {
        if (rows === null) {
            bot.sendChat('/me ' + config.responses.theme);
        } else {
            bot.sendChat('/me ' + rows.map(function (row) {
                    if (row.starts_at >= moment.utc().toDate()) {
                        row.title = timeUntil(row.starts_at) + ' ' + row.title;
                    }
                    if (row.details === null) {
                        return row.title;
                    }
                    else {
                        return row.title + ' - ' + row.details;
                    }
                }).join(' • '));
        }
    });
};