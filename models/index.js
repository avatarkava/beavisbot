let Sequelize = require("sequelize");
const { readdirSync } = require("fs");
let db = {};

let logLevel = false;
if (config.verboseLogging) {
  logLevel = console.log;
}

let sequelize = undefined;
if (config.db.dialect === "sqlite") {
  sequelize = new Sequelize(null, null, null, {
    dialect: config.db.dialect,
    storage: config.db.storage,
    logging: logLevel,
  });
} else if (config.db.dialect === "mariadb" || config.db.dialect === "mysql") {
  sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect,
    port: config.db.port,
    logging: logLevel,
    charset: "utf8",
    retry: { match: "ER_LOCK_DEADLOCK: Deadlock found when trying to get lock; try restarting transaction", max: 3 },
  });
}

try {
  sequelize.authenticate().then(function () {
    console.log("Connected to " + config.db.dialect + " database: " + config.db.database);
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// @TODO Do we do a sequelize sync here?
try {
  sequelize.sync({ alter: config.db.forceSequelizeSync }).then(function () {
    console.log("Synced sequelize to database: " + config.db.database);
  });
} catch (error) {
  console.error("Unable to sync the database:", error);
}

readdirSync("./models").forEach(function (file) {
  if (file.indexOf(".js") > -1 && file !== "index.js") {
    let model = require("./" + file)(sequelize, Sequelize);
    db[model.name] = model;
  }
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
