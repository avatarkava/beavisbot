exports.names = ['.event', '.calendar'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');

    RoomEvent.find({where: {type: 'event', starts_at: {lte: moment.utc().add(1, 'month').toDate()}, ends_at: {gte: new Date()}}}).on('success', function (row) {
        if (row === null) {
            bot.sendChat('/me No events currently scheduled.');
        } else {
            if (row.starts_at >= moment.utc().toDate()) {
                row.title = timeUntil(row.starts_at) + ' ' + row.title;
            }
            bot.sendChat('/me ' + row.title + ' - ' + row.details);
        }
    });

};