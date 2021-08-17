"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("guilds", {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      prefix: {
        defaultValue: ".",
        type: Sequelize.STRING,
      },
      opRoles: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      levels: {
        defaultValue: "[]",
        type: Sequelize.STRING,
      },
      invites: {
        defaultValue: "[]",
        type: Sequelize.STRING,
      },
      threadInactivityTime: {
        defaultValue: 1000 * 60 * 60 * 24 * 7,
        type: Sequelize.INTEGER,
      },
      moderationServer: {
        type: Sequelize.STRING,
      },
      modCooldown: {
        defaultValue: 1000 * 60 * 5,
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
