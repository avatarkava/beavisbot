exports.names = ['.ban', '.unban'];
exports.hidden = true;
exports.enabled = false;
exports.matchStart = true;
exports.handler = function (data) {

    // Only bouncers and above can call this
    if (data.from.role > 1) {

        var input = data.message.split(' ');
        var command = _.first(input);
        var params = _.rest(input);
        var username = '';

        if (params.length >= 2) {
            username = _.initial(params).join(' ').trim();
            duration = _.last(params).toUpperCase();
        }
        else if (params.length == 1) {
            username = params.join(' ').trim();
            var duration = 'PERMA';
        }
        else {
            bot.sendChat('Usage: .[ban|unban|kick] @username [PERMA|DAY|HOUR]');
            return;
        }

        // Don't let bouncers get too feisty (API should prohibit this, but just making sure!
        if (data.from.role == 2) {
            duration = 'HOUR';
        }

        switch (duration) {
            case 'HOUR':
                apiDuration = 60;
                break;
            case 'DAY':
                apiDuration = 1440;
                break;
            case 'PERMA':
            default:
                apiDuration = -1;
                break;
        }

        db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
            if (row) {
                switch (command) {
                    case '.ban':
                        bot.moderateBanUser(row.userid, 0, apiDuration, function () {
                            logger.warning('[BAN] ' + username + ' was banned for ' + duration + ' by ' + data.from.username);
                            db.run('UPDATE DISCIPLINE SET kicks = kicks + 1, lastAction = CURRENT_TIMESTAMP WHERE userid = ?', [row.userid]);
                        });
                        break;
                    case '.unban':
                        bot.moderateUnbanUser(row.userid, function () {
                            bot.sendChat('/me unbanning ' + username + '. This can take a few moments...');
                            logger.info('[UNBAN] ' + username + ' was unbanned by ' + data.from.username);
                        });
                        break;
                    default:
                        logger.error('Invalid command called: ' + command);
                        break;
                }
            }
        });

    }
};
