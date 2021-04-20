const Discord = require("discord.js");
const db = require("quick.db");
const commandUsage = require("../../../../utils/commandUsage.js");

exports.help = {
	name: "leaderboard",
	description: "Displays the bean leaderboard",
	usage: `leaderboard`,
	example: `leaderboard`,
};

exports.conf = {
	aliases: ["lb"],
	cooldown: 5,
};

const getUserAccounts = (message) => {
	let allData = db.all();

	try {
		let accounts = allData.filter((data) => data.ID === "account")[0];
		if (!accounts || !accounts.data) return;
		let accountsData = accounts.data;
		return accountsData;
	} catch (err) {
		commandUsage.error(
			message,
			"leaderboard",
			"There was an unexpected error while running the leaderboard command"
		);
		console.log(err);
	}
};

const getSortedDevBeansArray = (message, accounts) => {
	let devBeansArray = [];
	let goldenBeansArray = [];
	let guildID = message.guild.id;
	Object.keys(accounts).forEach((userID) => {
		let account = accounts[userID];
		if (account.devBeans) {
			devBeansArray.push({ id: userID, type: account.devBeans });
		}
	});
	devBeansArray.sort((a, b) => b.type - a.type);

	Object.keys(accounts).forEach((userID) => {
		let account = accounts[userID];
		if (account.goldenBeans) {
			goldenBeansArray.push({ id: userID, type: account.goldenBeans });
		}
	});
	goldenBeansArray.sort((a, b) => b.type - a.type);
	return { devBeansArray, goldenBeansArray };
};

exports.run = async (bot, message, args) => {
	let lbType;
	let goldenBeanEmoji = message.guild.emojis.cache.find((emoji) => emoji.name === "GoldenBean");
	let devBeanEmoji = message.guild.emojis.cache.find((emoji) => emoji.name === "DevBean");
	let lbEmbed;
	let lbArray = [];

	let accounts = await getUserAccounts(message);
	if (!accounts) return message.channel.send("There is no data from this server!");

	let arrays = await getSortedDevBeansArray(message, accounts);

	lbEmbed = new Discord.MessageEmbed().setTitle(`Beans Leaderboard`).setTimestamp().setColor(0xff9f01);

	let fields = formatLeaderboard(
		message,
		arrays.devBeansArray,
		arrays.goldenBeansArray,
		devBeanEmoji,
		goldenBeanEmoji
	);

	lbEmbed.addFields(
		{ name: "DevBeans", value: fields.devBeans, inline: true },
		{ name: "\u200B", value: "\u200B", inline: true },
		{ name: "GoldenBeans", value: fields.goldenBeans, inline: true }
	);

	message.channel.send(lbEmbed); /**/
};

function formatLeaderboard(message, devBeansArray, goldenBeansArray, devBeanEmoji, goldenBeanEmoji) {
	let devBeans = "";
	let goldenBeans = "";
	let rankOfUser = 1;
	let maxSize;

	if (devBeansArray.length >= 10) devBeansArray = devBeansArray.slice(0, 10);
	if (devBeansArray.length !== 0) {
		devBeansArray.forEach((useEntry) => {
			let userObject = message.guild.members.resolve(useEntry.id);
			if (!userObject) userObject = { user: { username: "User not found" } };
			let username = userObject.user.username;
			if (username.length > 25) {
				username = username.substring(0, 22).concat("...");
			}
			let addWord = `**${rankOfUser}) ${username}: ${useEntry.type}** ${devBeanEmoji} \n`;
			devBeans = devBeans.concat(addWord);
			rankOfUser = rankOfUser + 1;
		});
		maxSize = devBeansArray.length;
	} else {
		devBeans = `No one has any dev-beans yet!`;
	}

	rankOfUser = 1;
	if (goldenBeansArray.length >= 10) goldenBeansArray = goldenBeansArray.slice(0, 10);
	if (goldenBeansArray.length !== 0) {
		goldenBeansArray.forEach((useEntry) => {
			let userObject = message.guild.members.resolve(useEntry.id);
			if (!userObject) userObject = { user: { username: "User not found" } };
			let username = userObject.user.username || "User not found";
			if (username.length > 25) {
				username = username.substring(0, 22).concat("...");
			}
			let addWord = `**${rankOfUser}) ${username}: ${useEntry.type}** ${goldenBeanEmoji} \n`;
			goldenBeans = goldenBeans.concat(addWord);
			rankOfUser = rankOfUser + 1;
		});
		if (goldenBeansArray.length > maxSize) maxSize = goldenBeansArray.length;
	} else {
		goldenBeans = `No one has any golden-beans yet!`;
	}

	return { devBeans, goldenBeans, maxSize };
}
