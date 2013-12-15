var PlugAPI = require('plugapi');
var fs = require('fs');
var config = require('./config.json');

var UPDATECODE = '$&2h72=^^@jdBf_n!`-38UHs'; // We're not quite sure what this is yet, but the API doesn't work without it. It's possible that a future Plug update will change this, so check back here to see if this has changed, and set appropriately, if it has.

PlugAPI.getAuth({
    username: config.botinfo.twitterUsername,
    password: config.botinfo.twitterPassword
}, function(err, auth) { // if err is defined, an error occurred, most likely incorrect login
    if(err) {
        console.log("An error occurred: " + err);
        return;
    }
    
    initializeModules();
    
    bot.connect(config.roomName);

    bot.on('roomJoin', function(data) {    
        // Set up the room object
        room = data.room;
        
        console.log('Joined room', room);
        
        room.users.forEach(function(user) { addUserToDb(user); });

        //bot.chat('Hi! :cat:');
    });

    bot.on('chat', function(data) {
        console.log('[CHAT] ' + data.from + ': ' + data.message);
        handleCommand(data);
    });
    
    bot.on('emote', function(data) {
        console.log('[EMTE] ' + data.from + ': ' + data.from + ' ' + data.message);
        handleCommand(data);
    });
    
    bot.on('user_join', function(data) {
        console.log('[JOIN] ' + data.username);
        
        // Add to DB
        addUserToDb(data);
        
        room.users.push(data);
    })
    
    bot.on('user_leave', function(data) {
        console.log('User left: ', data);
        
        // Update DB
        db.run('UPDATE OR IGNORE USERS SET lastSeen = CURRENT_TIMESTAMP WHERE userid = ?', [data.id]);
        
        // Remove user from users list
        room.users.splice(_.pluck(room.users, 'id').indexOf(data.id), 1);
        
    });
    
    bot.on('userUpdate', function(data) {
        console.log('User update: ', data);
    });
    
    bot.on('curateUpdate', function(data) {
        console.log('[SNAG] ' + room.users.filter(function(user) { return user.id == data.id; })[0].username + ' snagged this song');
        
        room.curates[data.id] = true;
    });
    
    bot.on('dj_advance', function(data) {
        console.log('New song: ', data);
        
        // Write previous song data to DB
        db.run('INSERT OR IGNORE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [room.media.id, room.media.title, room.media.format, room.media.author, room.media.cid, room.media.duration]);
        
        db.run('INSERT INTO PLAYS (userid, songid, upvotes, downvotes, snags, started, listeners) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
        [room.currentDJ, 
        room.media.id, 
        _.values(room.votes).filter(function(vote) { return vote == 1; }).length, 
        _.values(room.votes).filter(function(vote) { return vote == -1; }).length, 
        _.values(room.curates).length, 
        room.users.length]);
        
        // Update room object
        room.media = data.data.media;
        room.djs = data.data.djs;
        room.votes = {};
        room.mediaStartTime = data.data.mediaStartTime;
        room.currentDJ = data.data.currentDJ;
        room.playlistID = data.data.playlistID;
        room.historyID = data.data.historyID;
        room.curates = {}; 
    });
    
    bot.on('djUpdate', function(data) {
        console.log('DJ update', data);
        room.djs = data.djs;
    });
    
    bot.on('update_votes', function(data) {
        console.log('[VOTE] ' + _.findWhere(room.users, {id: data.id}).username
            + ' voted ' + data.vote);
        
        // Log vote
        room.votes[data.id] = data.vote;
        
        // Check if bot needs to bop
        if (room.votes[bot.getSelf().id] == null) {
            
            upvotes = _.values(room.votes).filter(function(vote) { return vote == 1; }).length;
            target = room.users.length <= 3 ? 2 : Math.ceil(Math.pow(1.1383 * (room.users.length - 3), 0.6176));
            if (upvotes >= target) {
                bot.upvote();
            }
        }
    });
    
    function addUserToDb(user) {
        db.run('INSERT OR REPLACE INTO USERS VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', 
        [user.id,
        user.username,
        user.language,
        user.dateJoined.replace('T', ' '),
        user.avatarID]);
    }
    
    function initializeModules() {
        // load context
        require('./context.js')({auth: auth, updateCode: UPDATECODE, config: config});
        
        // Allow bot to perform multi-line chat
        bot.multiLine = true;
        bot.multiLineLimit = 3;
        
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
        
        initializeDatabase();
    }
    
    function initializeDatabase() {
        db.run('CREATE TABLE IF NOT EXISTS USERS (userid VARCHAR(255) PRIMARY KEY, username VARCHAR(255), language VARCHAR(10), dateJoined TIMESTAMP, avatarID VARCHAR(255), lastSeen TIMESTAMP)');
        
        db.run('CREATE TABLE IF NOT EXISTS SONGS (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), format VARCHAR(255), author VARCHAR(255), cid VARCHAR(255), duration DOUBLE)');
        
        db.run('CREATE TABLE IF NOT EXISTS PLAYS (id INTEGER PRIMARY KEY AUTOINCREMENT, userid VARCHAR(255), songid VARCHAR(255), upvotes INTEGER, downvotes INTEGER, snags INTEGER, started TIMESTAMP, listeners INTEGER)');
        
        db.run('CREATE TABLE IF NOT EXISTS CHAT (id INTEGER PRIMARY KEY AUTOINCREMENT, message VARCHAR(255), userid VARCHAR(255), timestamp TIMESTAMP)');
    }
    
    function handleCommand(data) {
        // unescape message
        data.message = S(data.message).unescapeHTML().s;
        
        var command = commands.filter(function(cmd) { 
            var found = false;
            for (i = 0; i < cmd.names.length; i++) {
                if (!found) {
                    found = (cmd.names[i] == data.message.toLowerCase() || (cmd.matchStart && data.message.toLowerCase().indexOf(cmd.names[i]) == 0));
                }
            }
            return found;
        })[0];
        
        if (command && command.enabled) {
            //run command
            command.handler(data);
        }
    }
});