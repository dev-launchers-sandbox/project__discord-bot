"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Warning, {
        foreignKey: "userId",
      });
    }
  }

  User.init(
    {
      devBeans: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      goldenBeans: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );

  return User;
};
