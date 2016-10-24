fs = require('fs');
config = require(process.cwd() + '/config.json');
PlugAPI = require('plugapi');

new PlugAPI({
    email: config.auth.username,
    password: config.auth.password
}, function (err, bot) {
    if (err) {
        console.log('Error initializing PlugAPI: ' + err);
    } else {

        bot.multiLine = true;
        bot.multiLineLimit = 5;

        //@TODO - Stop using globals
        require('./globals')({bot: bot, config: config});

        initializeModules(bot);

        bot.connect(config.roomName);
    }
});

function initializeModules(bot) {

    // Initialize functions, commands, events and extended stuff
    try {
        fs.readdirSync('./functions').forEach(function (file) {
            if (file.indexOf(".js") > -1) {
                require('./functions/' + file)(bot);
            }
        });
    } catch (e) {
        console.error('Unable to load function: ', e.stack);
    }

    loadEvents(bot);
    loadCommands(bot);
    loadExtensions(bot);

};