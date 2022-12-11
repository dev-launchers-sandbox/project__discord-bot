"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BeanType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BeanType.hasMany(models.BeanLog, {
        foreignKey: "beanTypeId",
      });
    }
  }
  BeanType.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "beantype",
    }
  );
  return BeanType;
};
