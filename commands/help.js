exports.names = ['.help', '.support'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    if (config.slack.webhookUrl === '') {
        bot.sendChat('Need help? Ask a mod! No mods around? Contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
    }
    else {

        var message = data.message.split(' ').slice(1).join(' ');
        var messageText = '@channel: ' + data.from.username + ' requested help in https://plug.dj/' + config.roomName;

        if (message.length > 0) {
            messageText += " \n`" + message + "`";
        }

        var formPayload = {
            text: messageText,
            username: bot.getUser().username,
            channel: config.slack.default.channel,
            icon_url: config.slack.default.icon_url
        }

        formPayload = JSON.stringify(formPayload);

        request.post(config.slack.webhook_url, {form: {payload: formPayload}}, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                if (body == 'ok') {
                    bot.sendChat('A mod has been contacted, @' + data.from.username + '. One will be on the way soon.');
                }
                else {
                    bot.sendChat('Need help? Ask a mod! No mods around? Contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
                }
            }
        });
    }
}