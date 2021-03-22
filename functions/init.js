const { readdirSync } = require("fs");
const reload = require('require-reload')(require);   

module.exports = function () {  

  loadCommands = function () {    

    // Load commands
    try {
      bot.commands = [];
      readdirSync("./commands/").forEach(function (file) {
        if (file.indexOf(".js") > -1) {          
          var command = reload(`../commands/${file}`);
          command.lastRun = 0;
          command.lastRunUsers = {};
          if (command.minRole === undefined) {
            command.minRole = PERMISSIONS.NONE;
          }
          bot.commands.push(command);
        }
      });
      console.log("[INIT] Commands loaded...");      
    } catch (e) {
      console.error("Unable to load command: ", e.stack);
    }
  };

  // @TODO Change events to work the same as commands (exports without a constructor?)
  loadEvents = function () {

    try {
      readdirSync("./events/").forEach(function (file) {        
        if (file.indexOf(".js") > -1) {          
          reload(`../events/${file}`)();
        }
      });
      console.log("[INIT] Events loaded...");
    } catch (e) {
      console.error("Unable to load event: ", e.stack);
    }
  };

  loadExtensions = function () {
    try {
      readdirSync("./extensions").forEach(function (file) {
        if (file.indexOf(".js") > -1) {
          reload(`../extensions/${file}`)();
        }
      });
      console.log("[INIT] Extensions loaded...");
    } catch (e) {
      console.error("Unable to load extension: ", e.stack);
    }
  };
};
