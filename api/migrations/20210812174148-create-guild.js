"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("guilds", {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      guildId: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      prefix: {
        defaultValue: ".",
        type: Sequelize.STRING,
      },
      defaultMemberRoles: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      opRoles: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      levels: {
        defaultValue: "[]",
        type: Sequelize.STRING(1024),
      },
      invites: {
        defaultValue: "[]",
        type: Sequelize.STRING(1024),
      },
      threadInactivityTime: {
        defaultValue: 60 * 24 * 2, // 2 days in minutes
        type: Sequelize.INTEGER,
      },
      moderationServer: {
        type: Sequelize.STRING,
      },
      modCooldown: {
        defaultValue: 5, //5 minutes
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("guilds");
  },
};
