"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Reminder.init(
    {
      channel: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      body: DataTypes.TEXT,
      date: DataTypes.DATE,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "reminder",
    }
  );
  return Reminder;
};
