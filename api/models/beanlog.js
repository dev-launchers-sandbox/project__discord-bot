"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BeanLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BeanLog.init(
    {
      beanType: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      givenBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BeanLog",
    }
  );
  return BeanLog;
};
