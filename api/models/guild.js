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
      Guild.hasMany(models.Channel, {
        foreignKey: "guildId",
      });
    }
  }
  Guild.init(
    {
      discordId: DataTypes.STRING,
      prefix: DataTypes.STRING,
      opRoles: DataTypes.ARRAY(DataTypes.STRING),
      defaultMemberRoles: DataTypes.ARRAY(DataTypes.STRING),
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
      modCooldown: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "guild",
    }
  );
  return Guild;
};
