// Utility libraries used throughout the app
global._ = require("underscore");
global.moment = require("moment");
global.slugify = require("slugify");

const { existsSync, readFileSync, readdirSync } = require("fs");
require("popyt");
//import { decode, encode } from "html-entities";

// Reload the last existing state of the config file, otherwise revert to the default
global.config = {};
if (existsSync("configState.json")) {
  config = JSON.parse(readFileSync("configState.json", "utf-8"));
  console.log("Loaded config file from configState.json");
} else {
  config = JSON.parse(readFileSync("config.json", "utf-8"));
  console.log("Loaded config file from config.json");
}

global.models = require('./models/index');

// @FIXME - YouTube connectivity
/*
if (config.apiKeys.youtube !== undefined) {
  console.log("[YOUTUBE]", "Authenticating with youtube...");
  var oauth = YouTube.authenticate({
    type: "key",
    key: config.apiKeys.youtube.api_key,
  });
  console.log("[YOUTUBE]", "Authenticated! " + JSON.stringify(oauth, null, 2));
}
*/

/**
 * Custom functions accessible to commands
 */

/*
const getActiveDJs = function (maxIdleMins, startPosition, callback) {
  var activeUsers = [];
  if (startPosition === undefined) {
    startPosition = 0;
  }

  Promise.map(_.rest(bot.getDJs(), startPosition), function (dj) {
    return models.User.find({
      where: { site_id: dj.id, site: config.site },
    }).then(function (dbUser) {
      if (dbUser !== null && dbUser.site_id !== bot.getSelf().id) {
        if (secondsSince(dbUser.last_active) <= maxIdleMins * 60) {
          activeUsers.push(dbUser);
        }
      }
    });
  }).then(function () {
    callback(activeUsers);
  });
};
*/

const Bot = require("ttapi");
global.bot = new Bot(config.auth.authKey, config.auth.userId);
bot.commands = [];
bot.user = {};
//bot.debug = config.verboseLogging;

global.roomState = {};
roomState.mentions = { lastRunAll: 0, lastRunUsers: [] };

require("./globals.js")();

try {
  readdirSync("./functions").forEach(function (file) {
    if (file.indexOf(".js") > -1) {
      require(`./functions/${file}`)();
    }
  });
} catch (e) {
  console.error("Unable to load function: ", e.stack);
}

loadEvents();
loadCommands();
loadExtensions();
