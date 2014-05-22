exports.names = ['.ban', '.unban'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {

    var permission = _.findWhere(room.users, {id: data.fromID}).permission;

    // Only bouncers and above can call this
    if (permission > 1) {

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
        if (permission == 2) {
            duration = 'HOUR';
        }

        switch(duration) {
            case 'HOUR':
                apiDuration = 'API.BAN.HOUR';
                break;
            case 'DAY':
                apiDuration = 'API.BAN.DAY';
                break;
            case 'PERMA':
            default:
                apiDuration = 'API.BAN.PERMA';
                break;
        }

        db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
            switch(command) {
                case '.ban':
                    bot.moderateUnbanUser(row.userid, function() {
                        bot.moderateBanUser(row.userid, '', apiDuration);
                    });
                    bot.log('[BAN] ' + username + ' was banned for ' + duration + ' by ' + data.from);
                    db.run('UPDATE DISCIPLINE SET kicks = kicks + 1, lastAction = CURRENT_TIMESTAMP WHERE userid = ?', [row.userid]);
                    break;
                case '.unban':
                    bot.moderateUnbanUser(row.userid);
                    bot.sendChat('/me' + username + ' was unbanned by ' + data.from);
                    bot.log('[UNBAN] ' + username + ' was unbanned by ' + data.from);
                    break;
            }
        });

    }
};
