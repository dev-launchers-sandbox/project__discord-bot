const db = require("quick.db");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");
const { Guild, Channel } = require("./../../../../../api/models");
const migrationsHandler = require("./../../structures/MigrationHandler.js");

exports.help = {
  name: "migrateGuilds",
  description: "Migrates all the data for the guilds",
  usage: "migrateGuilds",
  example: "migrateGuilds",
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ["ADMINISTRATOR"],
};

exports.run = async (client, message, args) => {
  const guilds = client.guilds.cache;
  for (const guild of guilds) {
    //guild: [id, {guildObject}]
    const guildId = guild[0];
    const guildName = guild[1].name;

    //If the guild is found in the db, skip to the next one.
    if ((await Guild.findOne({ where: { id: guildId } })) !== null) {
      message.channel.send(`${guildName} already has been created`);
      continue;
    }

    // =============================================================================================
    // Guild Migration =============================================================================
    // =============================================================================================

    /*
     * For things that can be copy-pasted, with no modifications being made to the data,
     * we will use the system below
     */
    const guildKeys = [
      { oldKey: `prefix.${guildId}`, newKey: "prefix" },
      { oldKey: `${guildId}.newUserRoles`, newKey: "defaultMemberRoles" },
      { oldKey: `moderation-server.${guildId}`, newKey: "moderationServer" },
    ];

    const guildObject = migrationsHandler.copyData(guildKeys);
    guildObject.id = guildId;

    //Special cases that require more than a copy paste.
    const opRoles = [];
    const modRole = db.get(`moderator.${guildId}`);
    const adminRole = db.get(`admin.${guildId}`);
    if (modRole !== null) opRoles.push(modRole);
    if (adminRole !== null) opRoles.push(adminRole);
    if (opRoles.length > 0) guildObject.opRoles = opRoles;

    const levels = [];
    const levelNums = [
      "one",
      "five",
      "ten",
      "fifteen",
      "twenty",
      "twenty-five",
      "thirty",
      "thirty-five",
      "forty",
    ];

    for (const levelNum of levelNums) {
      levels.push({ name: levelNum, role: db.get(`levels.${guildId}.${levelNum}`) });
    }
    guildObject.levels = levels;

    const invites = [];
    const dbInvites = dbh.invite.getInvites(guildId);
    if (dbInvites) {
      Object.keys(dbInvites).forEach((inviteName) => {
        invites.push({ inviteName: inviteName, inviteCode: dbInvites[inviteName] });
      });
      if (invites.length > 0) guildObject.invites = invites;
    }

    const threadInactivityTime = db.get(`thread-inactivity-time.${guildId}`);
    if (threadInactivityTime) guildObject.threadInactivityTime = threadInactivityTime * 60; //hours to minutes

    const moderationServer = db.get(`moderationServer.${guildId}`);
    if (moderationServer) guildObject.moderationServer = moderationServer;

    const modCooldown = db.get(`mod-cooldown.${guildId}`);
    if (modCooldown) guildObject.modCooldown = parseInt(modCooldown);

    // =============================================================================================
    // Finish Guild Migration ======================================================================
    // =============================================================================================

    const dbGuild = await Guild.create(guildObject);

    await message.channel.send(
      `Created guild for **${guildName}** with attributes: \`\`\`${Object.keys(dbGuild.dataValues).map(
        (attribute) => dbGuild.dataValues[attribute]
      )}\`\`\``
    );

    // =============================================================================================
    // Channels Migration ==========================================================================
    // =============================================================================================
    await message.channel.send("Starting to migrate the **important channels...**");

    /*
     * For things that can be copy-pasted, with no modifications being made to the data,
     * we will use the system below
     */
    const channelsKeys = [
      { oldKey: `welcome.${guildId}`, newKey: "welcome" },
      { oldKey: `audit.${guildId}`, newKey: "auditLog" },
      { oldKey: `total.${guildId}`, newKey: "memberCounter" },
      { oldKey: `threads-category.${guildId}`, newKey: `threadCategory` },
      { oldKey: `directory-channel.${guildId}`, newKey: "threadDirectory" },
      { oldKey: `teams.${guildId}`, newKey: "teamsAndProjects" },
      { oldKey: `introductions-channel.${guildId}`, newKey: "introductions" },
      { oldKey: `invite.${guildId}`, newKey: invites },
    ];

    const channelsObject = migrationsHandler.copyData(channelsKeys);
    channelsObject.guildId = guildObject.id;

    //Special cases that require more than a copy paste.
    const controlCenter = db.get(`control-center.${guildId}`);
    if (controlCenter) channelsObject.newUserMention = [controlCenter];

    // =============================================================================================
    // Finish Channel Migration ====================================================================
    // =============================================================================================

    const dbChannels = await Channel.create(channelsObject);

    await message.channel.send(
      `Created guild for **${dbChannels.id}** with attributes: \`\`\`${Object.keys(
        dbChannels.dataValues
      ).map((attribute) => dbChannels.dataValues[attribute])}\`\`\``
    );

    await message.channel.send("Important channel data migration has been **completed.**");
  }
};
