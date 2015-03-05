exports.names = ['.theme'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');

    RoomEvent.find({where: {type: 'theme', starts_at: {lte: new Date()}, ends_at: {gte: new Date()}}}).on('success', function (row) {
        if (row === null) {
            bot.sendChat('/me ' + config.responses.theme);
        } else {
            bot.sendChat('/me ' + row.title + ' - ' + row.details);
        }
    });

};