module.exports = function (bot) {

    sendToSlack = function (message) {

        if (message == '' || config.slack.webhook_url == null) {
            return false;
        }

        var formPayload = {
            text: message,
            username: bot.getSelf().username,
            link_names: 1,
            channel: config.slack.default.channel,
            icon_url: config.slack.default.icon_url
        }

        formPayload = JSON.stringify(formPayload);

        request.post(config.slack.webhook_url, {form: {payload: formPayload}}, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                if (body == 'ok') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                console.log(error);
                return false;
            }
        });
    };
}