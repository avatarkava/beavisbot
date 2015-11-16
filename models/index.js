'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var config = require(__dirname + '/../config.json');
var db = {};
var logLevel = false;

if (config.verboseLogging) {
    var logLevel = console.log;
}

if (config.db.dialect === 'sqlite') {
    var sequelize = new Sequelize(null, null, null, {
        dialect: config.db.dialect,
        storage: config.db.storage,
        logging: logLevel
    });
}
else if (config.db.dialect === 'mysql') {
    var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
        host: config.db.host,
        dialect: config.db.dialect,
        port: config.db.port,
        logging: logLevel,
    });
}

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function (file) {
        if (file.slice(-3) !== '.js') return;
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
