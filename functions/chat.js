module.exports = function () {
  const Cleverbot = require("cleverbot-node");
  let cleverbot = new Cleverbot();
  cleverbot.configure({ botapi: config.apiKeys.cleverbot });

  chatResponse = function (data) {
    if (data.userid === undefined) {
      return;
    }

    const input = data.text.split("@", 2);
    const command = input[0].trim();
    let target = null;
    if (input.length > 1) {
      target = input[1].trim();
    }

    models.EventResponse.findOne({
      where: { event_type: "chat", pattern: command, is_active: true },
      order: models.sequelize.random()
    }).then(function (row) {
      if (row === null) {
        return;
      } else if (target != null) {
        // Remove /me from the beginning of targeting since it won't alert someone
        if (row.response.indexOf("/me") === 0) {
          row.response = "@" + target + " " + S(row.response).chompLeft("/me").s;
        } else {
          row.response = "@" + target + " " + row.response;        
        }
      }

      bot.speak(row.response.replace("{sender}", data.name));
    });
  };

  handleChat = function (data) {
    // Only listen to the superAdmin when in development mode
    if (data.userid === undefined || (config.developmentMode && data.name !== config.superAdmin)) {
      return;
    }

    // unescape message
    /*
  // data.text = S(data.text).unescapeHTML().s;
  data.text = data.text.replace(/&#39;/g, "'");
  data.text = data.text.replace(/&#34;/g, '"');
  data.text = data.text.replace(/&amp;/g, "&");
  data.text = data.text.replace(/&lt;/gi, "<");
  data.text = data.text.replace(/&gt;/gi, ">");
  */

    if (data.text.charAt(0) === config.commandLiteral) {
      // Chop off the command literal
      data.text = data.text.substr(1);

      // Don't allow @mention to the bot - prevent loopback
      data.text = data.text.replace("@" + bot.user.name, "");

      const command = bot.commands.filter(function (cmd) {
        let found = false;
        for (i = 0; i < cmd.names.length; i++) {
          if (!found) {
            found = cmd.names[i] == _.first(data.text.toLowerCase().split(" "));
          }
        }
        return found;
      })[0];

      if (command && command.enabled) {
        let can_run_command = true;
        const cur_time = Date.now() / 1000;
        const time_diff = cur_time - command.lastRun;
        let time_diff_user = cur_time;
        if (data.userid in command.lastRunUsers) {
          time_diff_user -= command.lastRunUsers[data.userid];
        }

        /*
        if (data.from.role >= PlugAPI.ROOM_ROLE.BOUNCER) {
          if (command.cdStaff >= time_diff) {
            console.log("[ANTISPAM]", data.name + " cannot run the command due to antispam (cdStaff) " + time_diff);
            can_run_command = false;
          }
        } else {
          if (command.cdAll >= time_diff) {
            console.log("[ANTISPAM]", data.name + " cannot run the command due to antispam (cdAll) " + time_diff);
            can_run_command = false;
          } else if (command.cdUser >= time_diff_user) {
            console.log("[ANTISPAM]", data.name + " cannot run the command due to antispam (cdUser) " + time_diff_user);
            can_run_command = false;
          }
        }
        */

        if (config.verboseLogging) {
          console.log("[COMMAND]", JSON.stringify(data, null, 2));
        }

        if (can_run_command && hasPermission(data.userid, command.minRole)) {
          const r = command.handler(data);
          if (typeof r === "object" && "cdAll" in r && "cdUser" in r) {
            command.lastRun = cur_time - command.cdAll + r.cdAll;
            command.lastRunUsers[data.userid] = cur_time - command.cdUser + r.cdUser;
          } else if (r !== false) {
            command.lastRun = cur_time;
            command.lastRunUsers[data.userid] = cur_time;
          }
        }
      } else if (!config.quietMode) {
        // @TODO - Build the list of possible commands on init() instead of querying every time
        chatResponse(data);
      }
    } else if (!config.quietMode && data.text.indexOf("@" + bot.user.name) > -1) {
      mentionResponse(data);
    }
  };

  mentionResponse = function (data) {
    if (data.userid === undefined) {
      return;
    }

    // Antispam
    const cooldown_all = 10;
    const cooldown_user = 30;
    const cur_time = Date.now() / 1000;
    const time_diff = cur_time - roomState.mentions.lastRunAll;
    let time_diff_user = cur_time;

    if (data.userid in roomState.mentions.lastRunUsers) {
      time_diff_user -= roomState.mentions.lastRunUsers[data.userid];
    }

    if (cooldown_all >= time_diff) {
      console.log("[ANTISPAM]", data.name + " cannot chat with the bot - antispam (all) " + time_diff);
    } else if (cooldown_user >= time_diff_user) {
      console.log("[ANTISPAM]", data.name + " cannot chat with the bot - antispam (user) " + time_diff_user);
    } else {
      if (config.verboseLogging) {
        console.log(`[ANTISPAM] ${data.name} passed antispam (user) ${time_diff_user}:${time_diff}`);
      }
      roomState.mentions.lastRunAll = cur_time;
      roomState.mentions.lastRunUsers[data.userid] = cur_time;

      // How much ADHD does the bot have?
      const chatRandomnessPercentage = config.chatRandomnessPercentage;

      if (_.random(1, 100) > chatRandomnessPercentage) {
        const cleverMessage = data.text.replace("@" + bot.user.name, "").trim();
        cleverbot.write(cleverMessage, function (response) {
          if (config.verboseLogging) {
            console.log("[CLEVERBOT]", JSON.stringify(response, null, 2));
          }

          if (response != null) {
            bot.speak("@" + data.name + ", " + response.output);
          }
        });
      } else {
        models.EventResponse.find({
          where: { event_type: "mention", is_active: true },
          order: "RAND()",
        }).then(function (row) {
          if (row === null) {
            return;
          } else {
            bot.speak(row.response.replace("{sender}", data.name));
          }
        });
      }
    }
  };

  getGiphy = function (type, api_key, rating, tags, limit, returnData) {
    let reqparams = {
      format: "json",
      api_key: api_key,
      rating: rating,
      limit: limit,
    };
    if (type == "giphyt") {
      endpoint = "/v1/gifs/translate";
      search_param = "s";
    } else if (type == "giphys") {
      endpoint = "/v1/stickers/random";
      search_param = "tag";
      tags = tags.replace(/\+/g, "-");
    } else {
      endpoint = "/v1/gifs/search";
      search_param = "q";
    }

    if (tags !== undefined) {
      reqparams[search_param] = tags;
    }

    /*
    request(
      {
        url: "https://api.giphy.com" + endpoint + "?",
        qs: reqparams,
        method: "GET",
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
          returnData(null);
        } else {
          try {
            var data = JSON.parse(body);

            if (config.verboseLogging) {
              data.calloutendpoint = endpoint;
              data.calloutqs = reqparams;
              console.log("[GIPHY] ", JSON.stringify(data, null, 2));
            }
            var randomNumber = _.random(0, data.data.length);
            if (type == "giphys") {
              returnData(data.data[randomNumber].image_url.split(/[?#]/)[0]);
            } else {
              returnData(
                data.data[randomNumber].images.fixed_height.url.split(/[?#]/)[0]
              );
            }
          } catch (error) {
            returnData(null);
          }
        }
      }
    );
    */
  };
};
