module.exports = function () {
  sendToWebhooks = function (message) {
    if (message == "") {
      return false;
    }

    if (config.webhooks.discord.webhookUrl != null) {
      sendToDiscord(message);
    }

    if (config.webhooks.slack.webhookUrl != null) {
      sendToSlack(message);
    }
  };

  sendToDiscord = function (message) {
    var formPayload = {
      content: message,
      username: bot.getSelf().username,
      avatar_url: config.webhooks.discord.default.avatarUrl,
    };

    formPayload = JSON.stringify(formPayload);

    request.post(config.webhooks.discord.webhookUrl, { form: { payload_json: formPayload } }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (body == "ok") {
          return true;
        } else {
          return false;
        }
      } else {
        console.log(error);
        return false;
      }
    });
  };

  sendToSlack = function (message) {
    var formPayload = {
      text: message,
      username: bot.getSelf().username,
      link_names: 1,
      channel: config.webhooks.slack.default.channel,
      icon_url: config.webhooks.slack.default.iconUrl,
    };

    formPayload = JSON.stringify(formPayload);

    request.post(config.webhooks.slack.webhookUrl, { form: { payload: formPayload } }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (body == "ok") {
          return true;
        } else {
          return false;
        }
      } else {
        console.log(error);
        return false;
      }
    });
  };
  return exports;
};
