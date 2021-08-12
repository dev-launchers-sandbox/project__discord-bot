"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Thread.init(
    {
      guildId: DataTypes.STRING,
      channelId: DataTypes.STRING,
      roleId: DataTypes.STRING,
      threadCreatorId: DataTypes.STRING,
      invites: DataTypes.ARRAY(DataTypes.STRING),
      customInvites: DataTypes.ARRAY(DataTypes.STRING),
      blacklist: DataTypes.ARRAY(DataTypes.STRING),
      isPublic: DataTypes.BOOLEAN,
      directoryMessageId: DataTypes.STRING,
      description: DataTypes.STRING,
      moderatorChannelId: DataTypes.STRING,
      lastNameChange: DataTypes.DATE,
      lastDescriptionChange: DataTypes.DATE,
      lastReminder: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "thread",
    }
  );
  return Thread;
};
