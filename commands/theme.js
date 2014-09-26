exports.names = ['.theme'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = true;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var theme = _.rest(input, 1).join(' ');

    if (data.from.role > 2 && theme) {

        if (theme == 'reset' || theme == 'clear') {
            theme = config.responses.theme;
        }

        //db.run('REPLACE INTO SETTINGS (name, value, userid, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', ['theme', theme, data.from.id],
        //    function (error) {
        //        if (error) {
        //            bot.sendChat('An error occurred.');
        //            logger.error('Error while updating theme. ', error);
        //        } else {
        //            logger.info("[THEME] " + theme);
        //            bot.sendChat('Theme updated, ' + data.from.username);
        //        }
        //        bot.moderateDeleteChat(data.id);
        //    });
    }
    else {
        RoomEvent.find({where: {type: 'theme', starts_at: {lte: new Date()}, ends_at: {gte: new Date()}}}).on('success', function (row) {
            if (row === null) {
                bot.sendChat('/me ' + config.responses.theme);
            } else {
                bot.sendChat('/me ' + row.title + ' - ' + row.details);
            }
        });
    }
};