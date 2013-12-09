module.exports = function(options) {
    var PlugAPI = require('plugapi');
    var sqlite3 = require('sqlite3').verbose();
    
    bot = new PlugAPI(options.auth, options.updateCode); 
    config = options.config;
    db = new sqlite3.Database('sparkle.sqlite');
    package = require('./package.json');
    request = require('request');
    _ = require('underscore');
    commands = [];
    
    room = {
        users: [],
        djs: [],
        media: {},
        votes: {},
        curates: {}
    };
};