exports.names = ['callmod'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var message = data.message.split(' ').slice(1).join(' ').trim();

    if (config.slack.webhookUrl === '') {
        bot.sendChat('Need help? Ask a staff member!');
    }
    else if(message === '') {
        bot.sendChat('Need help? Type '  + config.commandLiteral + 'callmod with the nature of your request - for example `' + config.commandLiteral + 'callmod Someone is spamming the chat!` (Don\'t abuse this!)');
    }
    else {

        var formPayload = {
            text: '@channel - ' + data.from.username + ' requested help in https://www.dubtrack.fm/join/' + config.roomName + " \n`" + message + "`",
            username: bot.getSelf().username,
            link_names: 1,
            channel: config.slack.default.channel,
            icon_url: config.slack.default.icon_url
        }

        formPayload = JSON.stringify(formPayload);

        request.post(config.slack.webhook_url, {form: {payload: formPayload}}, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                if (body == 'ok') {
                    bot.sendChat('A mod has been contacted and will be on the way if available, @' + data.from.username);
                }
                else {
                    bot.sendChat('There was an error sending your request.');
                }
            }
            else {
                console.log(error);
            }
        });
    }
}