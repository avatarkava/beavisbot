var PlugAPI = require('plugapi');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('sparkle.sqlite');
var config = require('./config.json');

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
    var bot = new PlugAPI(auth, UPDATECODE);
    bot.connect(config.roomName);

    bot.on('roomJoin', function(data) {
        // data object has information on the room - list of users, song currently playing, etc.
        console.log("Joined " + config.roomName + ": ", data);

        bot.chat('Hi! :cat:');
    });

    bot.on('chat', function(data) {
        console.log('Chat: ', data); 
        
        handleCommand(data);
    });
    
    bot.on('emote', function(data) {
        console.log('Emote: ', data);
        handleCommand(data);
    });
    
    bot.on('userJoin', function(data) {
        console.log('User Joined: ', data);
    })
    
    bot.on('userLeave', function(data) {
        console.log('User left: ', data);
    });
    
    bot.on('userUpdate', function(data) {
        console.log('User update: ', data);
    });
    
    bot.on('curateUpdate', function(data) {
        console.log('Snagged: ', data);
    });
    
    bot.on('djAdvance', function(data) {
        console.log('New song: ', data);
    });
    
    bot.on('djUpdate', function(data) {
        console.log('DJ update', data);
    });
    
    function handleCommand(data) {
        //TODO: replace with modular command files
        if (data.message == 'ping') {
            bot.chat('You\'re still here, ' + data.from);
        } else if (data.message == 'hugs ' + botname || data.message == ' hugs ' + botname) {
            bot.chat('/me hugs ' + data.from);
        }
    }
});