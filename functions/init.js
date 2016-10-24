module.exports = function (bot) {

    commands = [];

    loadCommands = function (bot) {

        // Load commands
        try {
            var dir = process.cwd() + '/commands/';
            fs.readdirSync(dir).forEach(function (file) {
                if (file.indexOf(".js") > -1) {
                    var command = require(dir + file);

                    command.lastRun = 0;
                    command.lastRunUsers = {};

                    if (command.minRole === undefined) {
                        command.minRole = PERMISSIONS.NONE;
                    }
                    commands.push(command);
                }
            });
            console.log("[INIT] Commands loaded...");
        } catch (e) {
            console.error('Unable to load command: ', e.stack);
        }
    };

    loadEvents = function (bot) {
        try {
            var dir = process.cwd() + '/events/';
            fs.readdirSync(dir).forEach(function (file) {
                if (file.indexOf(".js") > -1) {
                    require(dir + file)(bot);
                }
            });
            console.log("[INIT] Events loaded...");
        } catch (e) {
            console.error('Unable to load event: ', e.stack);
        }
    };

    loadExtensions = function (bot) {
        try {
            var dir = process.cwd() + '/extensions/';
            fs.readdirSync(dir).forEach(function (file) {
                if (file.indexOf(".js") > -1) {
                    require(dir + file)(bot);
                }
            });
            console.log("[INIT] Extensions loaded...");
        } catch (e) {
            console.error('Unable to load extension: ', e.stack);
        }
    };
};