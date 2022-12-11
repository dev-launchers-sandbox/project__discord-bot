module.exports = {
  development: {
    username: process.env.DISCORD_BOT_POSTGRES_USER,
    password: process.env.DISCORD_BOT_POSTGRES_PASSWORD,
    database: process.env.DISCORD_BOT_POSTGRES_DB,
    host: process.env.DISCORD_BOT_POSTGRES_HOST,
    dialect: "postgres",
    port: process.env.DISCORD_BOT_POSTGRES_PORT,
  },
};
