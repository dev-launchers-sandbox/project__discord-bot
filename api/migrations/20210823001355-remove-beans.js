"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("users", "devBeans"),
      queryInterface.removeColumn("users", "goldenBeans"),
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "devBeans", {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("users", "goldenBeans", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
