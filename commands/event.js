exports.names = ['event', 'calendar'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    //var input = data.message.split(' ');

    models.RoomEvent.findAll({
        where: {type: 'event', starts_at: {lte: moment.utc().add(1, 'month').toDate()}, ends_at: {gte: new Date()}},
        order: [['starts_at', 'ASC']],
        limit: 3
    }).then(function (rows) {
        if (rows.length === 0) {
            bot.speak('No events currently scheduled.');
        } else {
            bot.speak(rows.map(function (row) {
                var message = row.title;
                if (row.details !== null) {
                    message += ' - ' + row.details;
                }
                if (row.starts_at > moment.utc().toDate()) {
                    message = timeUntil(row.starts_at, 'starting') + ' ' + message;
                }
                else if (row.starts_at <= moment.utc().toDate()) {
                    message += ' ' + timeUntil(row.ends_at, 'ending');
                }

                return message;
            }).join(' • '));
        }
    });
};