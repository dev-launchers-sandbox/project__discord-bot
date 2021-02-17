exports.help = {
    name: "twitch",
    description: "Sends the link for DevLauncher's Twitch stream!",
    usage: "twitch",
    example: "twitch",
};

exports.conf = {
    aliases: ["stream"],
    cooldown: 5,
};

exports.run = async(client, message) => {
    message.channel.sendEmbed({
        title: "**DevLaunchers Twitch**",
        color: 0xff9f01,
        fields: [{ name: "URL:", value: "**https://www.twitch.tv/devlaunchers**", inline: false }]
    })
};