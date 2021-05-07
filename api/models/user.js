const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      devBeans: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      id: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
