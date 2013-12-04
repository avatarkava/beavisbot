var PlugAPI = require('plugapi');
var sqlite3 = require('sqlite3').verbose();

exports.bot;
exports.config;
exports.db;

module.exports = function(options){
    bot = new PlugAPI(options.auth, options.updateCode); 
    config = options.config;
    db = new sqlite3.Database('sparkle.sqlite');
    return this;
};