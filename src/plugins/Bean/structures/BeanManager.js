const LINE_SEPARATOR = "\n----------------------------\n";
require("dotenv").config(); //load .env vars
const DEVLAUNCHERS_GUILD_ID = process.env.MAIN_GUILD || "695791200052969482";

class BeanManager {
	constructor(dbh, client) {
		this.dbh = dbh;
		this.client = client;
	}

	getDevBeanEmoji() {
		const guild = this.client.guilds.resolve(DEVLAUNCHERS_GUILD_ID);
		return guild.emojis.cache.find((e) => e.name === "DevBean");
	}

	getGoldenBeanEmoji() {
		const guild = this.client.guilds.resolve(DEVLAUNCHERS_GUILD_ID);
		return guild.emojis.cache.find((e) => e.name === "GoldenBean");
	}

	sendDevBeanNotification(sender, recipient, message) {
		recipient.send(`${LINE_SEPARATOR}Someone has given you a **Dev Bean!** ${message.url}${LINE_SEPARATOR}`);
	}

	sendGoldenBeanNotification(sender, recipient, message) {
		recipient.send(
			`${LINE_SEPARATOR}*Wow... You got a golden bean!* Someone has **__Golden__ Beaned** your message! ${message.url}\n\n*Pay it forward and pass on your own Golden Bean by reacting to a message you love.*${LINE_SEPARATOR}`
		);
	}

	getBeanData(user) {
		return {
			devBeans: this.dbh.bean.getUserDevBeans(user),
			goldenBeans: this.dbh.bean.getUserGoldenBeans(user),
			foreverDevBeans: this.dbh.bean.getUserForeverDevBeans(user),
			foreverGoldenBeans: this.dbh.bean.getUserForeverGoldenBeans(user),
		};
	}
}

module.exports = BeanManager;
