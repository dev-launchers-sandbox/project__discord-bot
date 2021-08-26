"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Warning, {
        foreignKey: "userId",
      });
      User.hasMany(models.BeanLog, {
        foreignKey: "userId",
      });
    }
  }

  User.init(
    {},
    {
      sequelize,
      modelName: "user",
    }
  );
};
