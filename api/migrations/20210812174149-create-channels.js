"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("channels", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      guildId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "guilds",
          key: "id",
        },
      },
      welcome: {
        type: Sequelize.STRING,
      },
      auditLog: {
        type: Sequelize.STRING,
      },
      memberCounter: {
        type: Sequelize.STRING,
      },
      threadDirectory: {
        type: Sequelize.STRING,
      },
      threadCategory: {
        type: Sequelize.STRING,
      },
      teamsAndProjects: {
        type: Sequelize.STRING,
      },
      newUserMention: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      introductions: {
        type: Sequelize.STRING,
      },
      invites: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("channels");
  },
};
