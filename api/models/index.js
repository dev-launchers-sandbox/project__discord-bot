const Sequelize = require("sequelize");

const dbName = process.env.DISCORD_BOT_POSTGRES_DB;
const dbUser = process.env.DISCORD_BOT_POSTGRES_USER;
const dbPassword = process.env.DISCORD_BOT_POSTGRES_PASSWORD;
const dbHost = process.env.DISCORD_BOT_POSTGRES_HOST;
const dbPort = process.env.DISCORD_BOT_POSTGRES_PORT;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {
  User: require("./user")(sequelize, Sequelize.DataTypes),
  Warning: require("./warning")(sequelize, Sequelize.DataTypes),
  Thread: require("./thread")(sequelize, Sequelize.DataTypes),
  Guild: require("./guild")(sequelize, Sequelize.DataTypes),
  Channel: require("./channel")(sequelize, Sequelize.DataTypes),
};

db.sequelize = sequelize;

module.exports = db;
