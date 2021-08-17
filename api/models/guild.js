"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Guild extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: "guildId",
      });
    }
  }
  Guild.init(
    {
      prefix: DataTypes.STRING,
      opRoles: DataTypes.ARRAY(DataTypes.STRING),
      levels: {
        type: DataTypes.STRING,
        get: function () {
          return JSON.parse(this.getDataValue("levels"));
        },
        set: function (val) {
          return this.setDataValue("levels", JSON.stringify(val));
        },
      },
      invites: {
        type: DataTypes.STRING,
        get: function () {
          return JSON.parse(this.getDataValue("invites"));
        },
        set: function (val) {
          return this.setDataValue("invites", JSON.stringify(val));
        },
      },
      threadInactivityTime: DataTypes.INTEGER,
      moderationServer: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "guild",
    }
  );
  return Guild;
};
