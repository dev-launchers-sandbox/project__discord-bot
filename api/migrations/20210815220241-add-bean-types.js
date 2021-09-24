"use strict";
console.log("add bean types");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "beanTypes",
      [
        {
          name: "DevBean",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          name: "GoldenBean",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("beanTypes", null, {});
  },
};
