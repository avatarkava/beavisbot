exports.names = ['.event', '.calendar'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var event = _.rest(input, 1).join(' ');

    if (data.from.role > 2 && event) {

        //db.run('REPLACE INTO SETTINGS (name, value, userid, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', ['event', event, data.from.id],
        //    function (error) {
        //        if (error) {
        //            bot.sendChat('An error occurred.');
        //            logger.error('Error while updating event. ', error);
        //        } else {
        //            logger.info("[EVENT] " + event);
        //            bot.sendChat('Event updated, ' + data.from.username);
        //        }
        //        bot.moderateDeleteChat(data.id);
        //    });
    }
    else {

        RoomEvent.find({where: {type: 'event', starts_at: {lte: moment.utc().add(1, 'month').toDate()}, ends_at: {gte: new Date()}}}).on('success', function (row) {
            if (row === null) {
                bot.sendChat('/me No events currently scheduled.');
            } else {
                bot.sendChat('/me ' + row.title + ' - ' + row.details);
            }
        });
    }
};