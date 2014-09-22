exports.names = ['.callmod'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var message = data.message.split(' ').slice(1).join(' ').trim();

    if (config.slack.webhookUrl === '') {
        bot.sendChat('Need help? Ask a mod! No mods around? Contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
    }
    else if(message === '') {
        bot.sendChat('Need help? Type .callmod with the nature of your request - for example `.callmod Someone is spinning dubstep!`');
    }
    else {

        var formPayload = {
            text: '@channel - ' + data.from.username + ' requested help in https://plug.dj/' + config.roomName + " \n`" + message + "`",
            username: bot.getUser().username,
            link_names: 1,
            channel: config.slack.default.channel,
            icon_url: config.slack.default.icon_url
        }

        formPayload = JSON.stringify(formPayload);

        request.post(config.slack.webhook_url, {form: {payload: formPayload}}, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                if (body == 'ok') {
                    bot.sendChat('A mod has been contacted and will be on the way if available, @' + data.from.username + '. You can also contact a Brand Ambassador: http://plug.dj/support - Hours: http://blog.plug.dj/brand-ambassadors/');
                }
                else {
                    bot.sendChat('There was an error sending your request.  In the meantime, please contact a Brand Ambassador: http://plug.dj/support');
                }
            }
        });
    }
}