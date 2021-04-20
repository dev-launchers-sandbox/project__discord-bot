const BeanManager = require("./../../structures/BeanManager.js");
const { removeReaction } = require("./../../../../utils/reactionUtils.js");

const ms = require("parse-ms");
const metrics = require("../../../../index.js");
const dbh = require("./../../../.common/structures/DataHandling/DatabaseHandler.js");

exports.eventHandle = "messageReactionAdd";
exports.event = async (client, messageReaction, reactor) => {
  metrics.sendEvent("message_reaction_add");
  let beanManager = new BeanManager(dbh, client);
  let message = messageReaction.message;
  if (message.partial) await message.fetch();
  let receiver = message.author;

  //if (receiver.id === reactor.id) return;
  if (receiver.bot || reactor.bot) return;

  if (messageReaction.isDevBeanReaction()) {
    let devBeanEmoji = beanManager.getDevBeanEmoji();

    if (dbh.bean.getDevBeanedMessages(reactor.id).includes(message.id)) {
      beanManager.showCross(message);
      reactor.sendEmbed({
        color: 0xff9f01,
        description: `You have already given a ${devBeanEmoji} to this message!`,
      });
      return;
    }

    let cooldown = beanManager.getDevBeanCooldown(reactor.id);
    if (cooldown) {
      reactor.sendEmbed({
        color: 0xff9f01,
        description: `You have to wait ${cooldown} second(s) before giving another ${devBeanEmoji}`,
      });
      removeReaction(message, devBeanEmoji.id, reactor.id); //remove the bean reaction
      beanManager.showCross(message); //display an X
    } else {
      dbh.bean.addDevBean(receiver.id);
      dbh.bean.setLastDevBeanGiven(reactor.id, Date.now());
      dbh.bean.addDevBeanedMessage(reactor.id, message.id);
      beanManager.sendDevBeanNotification(receiver, message);
      beanManager.showCheckmark(message);
    }
  }

  if (messageReaction.isGoldenBeanReaction()) {
    let goldenBeanEmoji = beanManager.getGoldenBeanEmoji();

    if (dbh.bean.getGoldenBeanedMessages(reactor.id).includes(message.id)) {
      beanManager.showCross(message);
      reactor.sendEmbed({
        color: 0xff9f01,
        description: `You have already given a ${goldenBeanEmoji} to this message!`,
      });
      return;
    }

    let cooldown = beanManager.getGoldenBeanCooldown(reactor.id);
    if (cooldown) {
      reactor.sendEmbed({
        color: 0xff9f01,
        description: `You have to wait ${cooldown.hours} hour(s) and ${cooldown.minutes} minute(s) before giving another ${goldenBeanEmoji}`,
      });
      removeReaction(message, goldenBeanEmoji.id, reactor.id);
      beanManager.showCross(message);
    } else {
      dbh.bean.addGoldenBean(receiver.id);
      dbh.bean.setLastGoldenBean(reactor.id, Date.now());
      dbh.bean.addGoldenBeanedMessage(reactor.id, message.id);
      beanManager.sendGoldenBeanNotification(receiver, message);
      beanManager.showCheckmark(message);
    }
  }
};
