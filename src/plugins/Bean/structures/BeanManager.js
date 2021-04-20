const ms = require("parse-ms");
const { removeReaction } = require("./../../../utils/reactionUtils.js");
require("dotenv").config(); //load .env vars
const pad_zero = (num) => (num < 10 ? "0" : "") + num;
const LINE_SEPARATOR = "\n----------------------------\n";
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

  async sendDevBeanNotification(recipient, message) {
    recipient.send(
      `${LINE_SEPARATOR}Someone has given you a **Dev Bean!** ${message.url}${LINE_SEPARATOR}`
    );
  }

  async sendGoldenBeanNotification(recipient, message) {
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

  getDevBeanCooldown(userId) {
    let timePerBean = 60000;
    let lastGivenDevBean = this.dbh.bean.getLastDevBeanGiven(userId);
    if (!lastGivenDevBean) return null;

    let cooldown = timePerBean - (Date.now() - lastGivenDevBean);
    if (cooldown > 0) {
      let timeRemaining = ms(cooldown);
      let seconds = pad_zero(timeRemaining.seconds).padStart(2, "");
      return seconds;
    } else return null;
  }

  getGoldenBeanCooldown(userId) {
    let timePerBean = 1000 * 60 * 60 * 24;
    let lastGivenGoldenBean = this.dbh.bean.getLastGoldenBeanGiven(userId);
    if (!lastGivenGoldenBean) return null;

    let cooldown = timePerBean - (Date.now() - lastGivenGoldenBean);
    if (cooldown > 0) {
      let timeRemaining = ms(cooldown);
      let hours = pad_zero(timeRemaining.hours).padStart(2, "");
      let minutes = pad_zero(timeRemaining.minutes).padStart(2, "");
      let seconds = pad_zero(timeRemaining.seconds).padStart(2, "");
      return { hours: hours, minutes: minutes, seconds: seconds };
    } else return null;
  }

  showCheckmark(message) {
    message.react("✅");
    setTimeout(() => {
      removeReaction(message, "✅", this.client.id);
    }, 2 * 1000);
  }

  showCross(message) {
    message.react("❌");
    setTimeout(() => {
      removeReaction(message, "❌", this.client.id);
    }, 2 * 1000);
  }
}

module.exports = BeanManager;
