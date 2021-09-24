"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("BeanLogs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      beanTypeId: {
        type: Sequelize.UUID,
        references: {
          model: "beanTypes",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: "users",
          key: "id",
        },
      },
      givenBy: {
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
    await queryInterface.dropTable("BeanLogs");
  },
};

/*


A beantype has many BeanLogs



*/
