"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("warnings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "users",
          key: "id",
        },
      },
      reason: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdBy: {
        allowNull: false,
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
    await queryInterface.dropTable("warnings");
  },
};
