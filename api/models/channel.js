"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Channel.init(
    {
      guildId: DataTypes.STRING,
      welcome: DataTypes.STRING,
      auditLog: DataTypes.STRING,
      memberCounter: DataTypes.STRING,
      threadDirectory: DataTypes.STRING,
      threadCategory: DataTypes.STRING,
      teamsAndProjects: DataTypes.STRING,
      newUserMention: DataTypes.ARRAY(DataTypes.STRING),
      introductions: DataTypes.STRING,
      invites: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "channel",
    }
  );
  return Channel;
};
