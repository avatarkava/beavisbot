module.exports = function () {

    chatResponse = function (data) {
        models.EventResponse.find({
                where: {event_type: 'chat', pattern: data.message, is_active: true},
                order: 'RAND()'
            })
            .then(function (row) {
                if (row === null) {
                    return;
                }
                else {
                    bot.sendChat(row.response.replace('{sender}', data.from.username));
                }

            });
    };

    handleCommand = function (data) {

        // Only listen to the superAdmin when in development mode
        if (config.developmentMode && data.from.username !== config.superAdmin) {
            return;
        }

        // unescape message
        data.message = S(data.message).unescapeHTML().s;

        data.message = data.message.replace(/&#39;/g, '\'');
        data.message = data.message.replace(/&#34;/g, '\"');
        data.message = data.message.replace(/&amp;/g, '\&');
        data.message = data.message.replace(/&lt;/gi, '\<');
        data.message = data.message.replace(/&gt;/gi, '\>');

        if (data.message.charAt(0) === config.commandLiteral) {

            // Chop off the command literal
            data.message = data.message.substr(1);

            // Don't allow @mention to the bot - prevent loopback
            data.message = data.message.replace('@' + botUser.username, '');

            var command = commands.filter(function (cmd) {
                var found = false;
                for (i = 0; i < cmd.names.length; i++) {
                    if (!found) {
                        found = (cmd.names[i] == _.first(data.message.toLowerCase().split(' ')));
                    }
                }
                return found;
            })[0];

            if (command && command.enabled) {

                var can_run_command = true;
                var cur_time = Date.now() / 1000;
                var time_diff = cur_time - command.lastRun;
                var time_diff_user = cur_time;
                if (data.from.id in command.lastRunUsers) {
                    time_diff_user -= command.lastRunUsers[data.from.id];
                }

                if (data.from.role >= PlugAPI.ROOM_ROLE.BOUNCER) {
                    if (command.cdStaff >= time_diff) {
                        console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdStaff) ' + time_diff);
                        can_run_command = false;
                    }
                } else {
                    if (command.cdAll >= time_diff) {
                        console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdAll) ' + time_diff);
                        can_run_command = false;
                    } else if (command.cdUser >= time_diff_user) {
                        console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdUser) ' + time_diff_user);
                        can_run_command = false;
                    }
                }

                if (config.verboseLogging) {
                    console.log('[COMMAND]', JSON.stringify(data, null, 2));
                }

                if (config.removeCommands && command.removeCommand !== false) {
                    bot.moderateDeleteChat(data.id);
                }

                if (can_run_command && hasPermission(data.from, command.minRole)) {

                    // Grab db data for the user that sent this message
                    getDbUserFromSiteUser(data.from, function (row) {
                        data.from.db = row;
                        var r = command.handler(data);
                        if (typeof r === 'object' && 'cdAll' in r && 'cdUser' in r) {
                            command.lastRun = cur_time - command.cdAll + r.cdAll;
                            command.lastRunUsers[data.from.id] = cur_time - command.cdUser + r.cdUser;
                        } else if (r !== false) {
                            command.lastRun = cur_time;
                            command.lastRunUsers[data.from.id] = cur_time;
                        }
                    });
                }
            }
            else if (!config.quietMode) {
                // @TODO - Build the list of possible commands on init() instead of querying every time
                chatResponse(data);
            }
        }
        else if (!config.quietMode && data.message.indexOf('@' + botUser.username) > -1) {
            mentionResponse(data);
        }
    };

    mentionResponse = function (data) {

        // Antispam
        var cooldown_all = 10;
        var cooldown_user = 30;
        var cur_time = Date.now() / 1000;
        var time_diff = cur_time - mentions.lastRunAll;
        var time_diff_user = cur_time;

        if (data.from.id in mentions.lastRunUsers) {
            time_diff_user -= mentions.lastRunUsers[data.from.id];
        }

        if (cooldown_all >= time_diff) {
            console.log('[ANTISPAM]', data.from.username + ' cannot chat with the bot - antispam (all) ' + time_diff);
        } else if (cooldown_user >= time_diff_user) {
            console.log('[ANTISPAM]', data.from.username + ' cannot chat with the bot - antispam (user) ' + time_diff_user);
        } else {

            if (config.verboseLogging) {
                console.log('[ANTISPAM]', data.from.username + ' passed antispam (user) ' + time_diff_user + ':' + time_diff);
            }
            mentions.lastRunAll = cur_time;
            mentions.lastRunUsers[data.from.id] = cur_time;

            // How much ADHD does the bot have?
            var chatRandomnessPercentage = 5;
            if (config.chatRandomnessPercentage) {
                chatRandomnessPercentage = config.chatRandomnessPercentage;
            }

            if (_.random(1, 100) > chatRandomnessPercentage) {
                var cleverMessage = data.message.replace('@' + botUser.username, '').trim();
                Cleverbot.prepare(function () {
                    cleverbot.write(cleverMessage, function (response) {
                        if (config.verboseLogging) {
                            console.log('[CLEVERBOT]', JSON.stringify(response, null, 2));
                        }
                        bot.sendChat('@' + data.from.username + ', ' + response.message);
                    });
                });
            }
            else {
                models.EventResponse.find({
                        where: {event_type: 'mention', is_active: true},
                        order: 'RAND()'
                    })
                    .then(function (row) {
                        if (row === null) {
                            return;
                        }
                        else {
                            bot.sendChat(row.response.replace('{sender}', data.from.username));
                        }

                    });
            }
        }
    };

    getGiphy = function (type, api_key, rating, tags, limit, returnData) {
        var reqparams = {format: 'json', api_key: api_key, "rating": rating, "limit": limit};
        if (type == 'giphyt') {
            endpoint = '/v1/gifs/translate';
            search_param = 's';
        } else if (type == 'giphys') {
            endpoint = '/v1/stickers/random';
            search_param = 'tag';
            tags = tags.replace(/\+/g, "-");
        } else {
            endpoint = '/v1/gifs/search';
            search_param = 'q';
        }

        if (tags !== undefined) {
            reqparams[search_param] = tags;
        }

        request({
            url: 'https://api.giphy.com' + endpoint + '?',
            qs: reqparams,
            method: 'GET'
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                returnData(null);
            } else {
                try {
                    var data = JSON.parse(body);

                    if (config.verboseLogging) {
                        data.calloutendpoint = endpoint;
                        data.calloutqs = reqparams;
                        console.log('[GIPHY] ', JSON.stringify(data, null, 2));
                    }
                    var randomNumber = _.random(0, data.data.length);
                    if (type == 'giphys') {
                        returnData(data.data[randomNumber].image_url);
                    } else {
                        returnData(data.data[randomNumber].images.fixed_height.url);
                    }
                }
                catch (error) {
                    returnData(null);
                }
            }
        });
    };
}