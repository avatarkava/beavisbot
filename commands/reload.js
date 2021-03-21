const { existsSync, readFileSync } = require("fs");
const reload = require("require-reload")(require);

exports.names = ["reload"];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 60;
exports.cdUser = 60;
exports.cdStaff = 60;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {
  // Reload the last existing state of the config file, otherwise revert to the default
  if (existsSync("configState.json")) {
    config = JSON.parse(readFileSync("configState.json", "utf-8"));
    console.log("Loaded config file from configState.json");
  } else {
    config = JSON.parse(readFileSync("config.json", "utf-8"));
    console.log("Loaded config file from config.json");
    writeConfigState();
  }

  // @TODO - Find a way to reload the events (bot.on bindings need to be purged and reset)
  // loadEvents(bot);

  loadCommands();
  loadExtensions();
  bot.speak(`Commands and config reloaded, @${data.name}!`);
};
