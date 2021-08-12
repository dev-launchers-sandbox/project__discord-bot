"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("threads", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      guildId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      channelId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      roleId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      threadCreatorId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      invites: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      customInvites: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      blacklist: {
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      isPublic: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      directoryMessageId: {
        type: Sequelize.STRING,
      },
      description: {
        defaultValue: "No description",
        type: Sequelize.STRING,
      },
      moderatorChannelId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastNameChange: {
        type: Sequelize.DATE,
      },
      lastDescriptionChange: {
        type: Sequelize.DATE,
      },
      lastReminder: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("threads");
  },
};
