var PlugAPI = require('plugapi');
var fs = require('fs');
var config = require('./config.json');
var commands = [];

var UPDATECODE = 'fe940c'; // We're not quite sure what this is yet, but the API doesn't work without it. It's possible that a future Plug update will change this, so check back here to see if this has changed, and set appropriately, if it has. You can omit using it if you wish - the value as of writing needs to be 'fe940c', and is hardcoded into the bot in the event it is not specified below.

// Instead of providing the AUTH, you can use this static method to get the AUTH cookie via twitter login credentials:
PlugAPI.getAuth({
    username: config.botinfo.twitterUsername,
    password: config.botinfo.twitterPassword
}, function(err, auth) { // if err is defined, an error occurred, most likely incorrect login
    if(err) {
        console.log("An error occurred: " + err);
        return;
    }
    
    initializeModules();
    
    var context = require('./context.js')({auth: auth, updateCode: UPDATECODE, config: config});
    context.bot.connect(config.roomName);

    context.bot.on('roomJoin', function(data) {
        // data object has information on the room - list of users, song currently playing, etc.
        console.log("Joined " + config.roomName + ": ", data);

        context.bot.chat('Hi! :cat:');
    });

    context.bot.on('chat', function(data) {
        console.log('Chat: ', data); 
        
        handleCommand(data);
    });
    
    context.bot.on('emote', function(data) {
        console.log('Emote: ', data);
        handleCommand(data);
    });
    
    context.bot.on('userJoin', function(data) {
        console.log('User Joined: ', data);
    })
    
    context.bot.on('userLeave', function(data) {
        console.log('User left: ', data);
    });
    
    context.bot.on('userUpdate', function(data) {
        console.log('User update: ', data);
    });
    
    context.bot.on('curateUpdate', function(data) {
        console.log('Snagged: ', data);
    });
    
    context.bot.on('djAdvance', function(data) {
        console.log('New song: ', data);
    });
    
    context.bot.on('djUpdate', function(data) {
        console.log('DJ update', data);
    });
    
    function initializeModules() {
        // Load commands
        try {
            fs.readdirSync('./commands').forEach(function(file) {
                var command = require('./commands/' + file);
                commands.push({names: command.names,
                    handler: command.handler,
                    hidden: command.hidden,
                    enabled: command.enabled,
                    matchStart: command.matchStart
                })
            });
        } catch (e) {
            console.error('Unable to load command: ', e);
        }
    }
    
    function handleCommand(data) {
        var command = commands.filter(function(cmd) { return cmd.names.indexOf(data.message) > -1; })[0];
        
        if (command) {
            //run command
            command.handler(context, data);
        }
    }
});