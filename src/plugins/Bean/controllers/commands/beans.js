const Discord = require("discord.js");
const BeanManager = require("./../../structures/BeanManager.js");
const dbh = require("../../../.common/structures/DataHandling/DatabaseHandler.js");


const getMessageTarget = require("../../../../utils/getMessageTarget");

exports.help = {
	name: "beans",
	description: "Shows your beans",
	usage: `beans [@user]`,
	example: `beans`,
};

exports.conf = {
	aliases: ["getbeans", "bal", "balance"],
	cooldown: 5,
};

exports.run = async (client, message, args) => {
	//Get the user mentioned, if there is none, assume it to be the message author
	let target = getMessageTarget.getMessageTarget(message, args);
	if (!target) target = message.guild.members.resolve(message.author.id);

	if (target.bot) {
		message.channel.send("Bots do not have a balance. They will **always have infinite beans**");
		return;
	}

	const beanManager = new BeanManager(dbh, client);
	const devBeanEmoji = beanManager.getDevBeanEmoji();
	const goldenBeanEmoji = beanManager.getGoldenBeanEmoji();
	const beanData = beanManager.getBeanData(target.id);

	message.channel.sendEmbed({
		color: 0xff9f01,
		author: { name: `${target.user.username}’s Beans Balance` },
		fields: [
			{ name: "Dev Beans", value: `${beanData.devBeans} Dev Bean(s) ${devBeanEmoji}` },
			{ name: "Golden Beans", value: `${beanData.goldenBeans} Golden Bean(s) ${goldenBeanEmoji}` },
		],
		footer: `All-time Dev Beans: ${beanData.foreverDevBeans} | All-time Golden Beans: ${beanData.foreverGoldenBeans}`,
	});
};
