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
            bot.sendChat('Usage: .[ban|unban|kick] username [PERMA|DAY|HOUR]');
            return;
        }

        var usernameFormatted = S(username).chompLeft('@').s;

        // Don't let bouncers get too feisty (API should prohibit this, but just making sure!
        if (data.from.role == 2) {
            duration = 'HOUR';
        }

        switch (duration) {
            case 'DAY':
                apiDuration = 1440;
                break;
            case 'PERMA':
                apiDuration = -1;
                break;
            case 'HOUR':
            default:
                apiDuration = 60;
                break;

        }

        //db.get('SELECT * FROM USERS LEFT JOIN DISCIPLINE USING(userid) WHERE username = ?', [username.substring(1)], function (error, row) {
        //    if (row) {
        //        switch (command) {
        //            case '.ban':
        //                bot.moderateBanUser(row.id, 0, apiDuration, function () {
        //                    logger.warning('[BAN] ' + username + ' was banned for ' + duration + ' by ' + data.from.username);
        //                    var userData = {
        //                        type: 'ban',
        //                        details: 'Banned for ' + duration + ' by ' + data.from.username,
        //                        user_id: row.id,
        //                        mod_user_id: data.from.id
        //                    };
        //                    Karma.create(userData);
        //                });
        //                break;
        //            case '.unban':
        //                bot.moderateUnbanUser(row.userid, function () {
        //                    bot.sendChat('/me unbanning ' + username + '. This can take a few moments...');
        //                    logger.info('[UNBAN] ' + username + ' was unbanned by ' + data.from.username);
        //                    var userData = {
        //                        type: 'unban',
        //                        details: 'Unbanned by ' + data.from.username,
        //                        user_id: row.id,
        //                        mod_user_id: data.from.id
        //                    };
        //                    Karma.create(userData);
        //                });
        //                break;
        //            default:
        //                logger.error('Invalid command called: ' + command);
        //                break;
        //        }
        //    }
        //});

        //if (config.slack.webhookUrl === '') {
        //    bot.sendChat('Need help? Ask a mod! No mods around? Contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
        //}
        //else if(message === '') {
        //    bot.sendChat('Need help? Type .callmod with the nature of your request - for example `.callmod Someone is spinning dubstep!`');
        //}
        //else {
        //
        //    var formPayload = {
        //        text: '@channel - ' + data.from.username + ' requested help in https://plug.dj/' + config.roomName + " \n`" + message + "`",
        //        username: bot.getUser().username,
        //        link_names: 1,
        //        channel: config.slack.default.channel,
        //        icon_url: config.slack.default.icon_url
        //    }
        //
        //    formPayload = JSON.stringify(formPayload);
        //
        //    request.post(config.slack.webhook_url, {form: {payload: formPayload}}, function (error, response, body) {
        //
        //        if (!error && response.statusCode == 200) {
        //            if (body == 'ok') {
        //                bot.sendChat('A mod has been contacted and will be on the way if available, @' + data.from.username + '. You can also contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
        //            }
        //            else {
        //                bot.sendChat('There was an error sending your request.  In the meantime, please contact a Brand Ambassador: http://plug.dj/support');
        //            }
        //        }
        //    });
        //}

    }
};
