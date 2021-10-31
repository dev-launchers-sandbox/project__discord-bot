exports.eventHandle = "ready";
exports.event = async (client) => {
  console.log("The bot is running!");
  client.user.setActivity("DiscordJS", { type: "PLAYING" });
};
