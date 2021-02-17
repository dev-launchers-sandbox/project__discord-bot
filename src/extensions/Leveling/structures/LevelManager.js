module.exports = class LevelManager {
	constructor(guild) {
		const db = require("quick.db");
		this.db = new db.table("leveling");
		this.guild = guild;
		this.config = {
			minXP: db.get(`minXP.${guild}`) || 5,
			maxXP: db.get(`maxXP.${guild}`) || 20,
			interval: db.get(`interval.${guild}`) * 1000 || 1000 * 15,
		};
	}

	// These methods are helper methods used in the class.
	random(a = 1, b = 0) {
		const lower = Math.ceil(Math.min(a, b));
		const upper = Math.floor(Math.max(a, b));
		return Math.floor(lower + Math.random() * (upper - lower + 1));
	}

	levelToXp(level, expOffset = 2) {
		return Math.round(0.5 * level ** 2) + level ** expOffset;
	}

	/**
	 * MATH:
	 * (0.5 * (x ** 2)) + (x ** 2)
	 * reversed is
	 * (root of x) - (0.5 * (root of x))
	 * Test: (0.5* root of x) - (0.5 * (root of x))
	 * Input: i give up i've made 40 of these now
	 * Output: ^^
	 */

	xpToLevel(xp) {
		const levelTable = require("../assets/levelTable");
		let highest = 0;
		for (let i = 0; i < levelTable.length; i++) {
			if (xp > levelTable[i]) {
				highest = i;
				continue;
			} else {
				return highest;
			}
		}
	}

	/**
	 * Generates a clean user object.
	 * @param {String} user The UserID to create an object for.
	 */
	createUserObject(user) {
		return {
			id: user,
			xp: 0,
		};
	}

	refreshConfig() {
		const db = require("quick.db");
		this.config = {
			minXP: db.get(`minXP.${this.guild}`) || 5,
			maxXP: db.get(`maxXP.${this.guild}`) || 20,
			interval: db.get(`interval.${this.guild}`) * 1000 || 1000 * 15,
		};
	}

	// These methods are slightly higher level or called directly by an external process
	resetQueueCycle() {
		this.refreshConfig();
		this.rewardQueuedUsers();
		this.db.set("queue", []);
		this.db.add("cycle", 1); // Used for statistics, and a general overall uptime determiner
	}

	rewardQueuedUsers() {
		let queued = this.getQueue();
		queued.forEach((userID) => {
			this.addUserExperience(
				userID,
				this.random(this.config.minXP, this.config.maxXP) / 2
			);
			console.log(
				`${userID} now has ${this.getUserData(userID).xp} XP now.`
			);
		});
	}

	createUser(user) {
		let userObject = this.createUserObject(user);
		this.db.set(`users.${user}`, userObject);
	}

	// These are low level methods that interact with the database
	addUserExperience(user, xp) {
		if (!this.getUserData(user)) this.createUser(user);
		this.db.add(`users.${user}.xp`, xp);
	}

	getUserData(user) {
		return this.db.get(`users.${user}`) || false;
	}

	getGuildData(message) {}

	getQueue() {
		return this.db.get("queue") || [];
	}

	queue(message) {
		let queue = this.getQueue();
		queue.push(message.author.id);
		// Remove duplicate users
		this.db.set("queue", [...new Set(queue)]);
	}

	sendProfileOf(target, message) {
		let avatar = target.user.avatarURL({ size: 1024 });

		message.channel.sendEmbed({
			title: `${target.user.username}'s Profile`,
			color: 0xff9f01,
			thumbnail: avatar,
			footer: { text: target.user.tag, image: avatar },
			fields: [
				{
					name: "Level",
					value: this.xpToLevel(this.getUserData(target.user.id).xp),
					inline: true,
				},
				{
					name: "XP",
					value: this.getUserData(target.user.id).xp,
					inline: true,
				},
			],
		});
	}

	onCycle(message) {
		return message.reply(`Current Cycle: ${this.db.get("cycle")}`);
	}
};
