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
        if (rows.length === 0) {
            bot.sendChat('/me ' + config.responses.theme);
        } else {
            bot.sendChat('/me ' + rows.map(function (row) {
                    var message = row.title;
                    if (row.details !== null) {
                        message += ' - ' + row.details;
                    }

                    if (row.starts_at > moment.utc().toDate()) {
                        message += ' ' + timeUntil(row.starts_at, 'starting');
                    }
                    else if (row.starts_at <= moment.utc().toDate()) {
                        message += ' ' + timeUntil(row.ends_at, 'ending');
                    }

                    return message;
                }).join(' • '));
        }
    });
}