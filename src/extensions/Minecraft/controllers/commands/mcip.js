exports.help = {
    name: "mcip",
    description: "Sends the IP for the DevLaunchers Minecraft Server!",
    usage: "mcip",
    example: "mcip",
};

exports.conf = {
    aliases: ["minecraftip", "ip"],
    cooldown: 5,
};

exports.run = async(client, message) => {
    message.channel.sendEmbed({
        title: "**DevLaunchers Minecraft Server**",
        color: 0xff9f01,
        fields: [{ name: "IP:", value: "**minecraft.devlaunchers.com:31672**", inline: false }]
    })
};