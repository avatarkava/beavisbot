exports.names = ['theme'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var input = _.rest(data.message.split(' '), 1);

    if (data.from.role >= PERMISSIONS.BOUNCER && input && input.length > 0) {

        var message = input.join(' ');

        if (message == 'clear' && config.themeOverride) {
            delete config.themeOverride;
            bot.sendChat('The theme has been cleared!');
        } else {
            config.themeOverride = message;
            bot.sendChat('The theme has been updated!');
        }
    } else if (config.themeOverride) {
        bot.sendChat(config.themeOverride);
    } else {
        models.RoomEvent.findAll({
            where: {
                type: 'theme',
                starts_at: {
                    lte: moment.utc().add(1, 'day').toDate()
                },
                ends_at: {
                    gte: new Date()
                }
            },
            order: [
                ['starts_at', 'ASC']
            ],
            limit: 3
        }).then(function (rows) {
            if (rows.length === 0) {
                bot.sendChat(config.responses.theme);
            } else {
                bot.sendChat(rows.map(function (row) {
                    var message = row.title;
                    if (row.details !== null) {
                        message += ' - ' + row.details;
                    }

                    if (row.starts_at > moment.utc().toDate()) {
                        message = timeUntil(row.starts_at, 'starting') + ' ' + message;
                    } else if (row.starts_at <= moment.utc().toDate()) {
                        message += ' ' + timeUntil(row.ends_at, 'ending');
                    }

                    return message;
                }).join(' • '));
            }
        });
    }
}