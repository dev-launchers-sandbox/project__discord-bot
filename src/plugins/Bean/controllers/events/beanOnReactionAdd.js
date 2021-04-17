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
    let cooldown = beanManager.getDevBeanCooldown(reactor.id);
    let devBeanEmoji = beanManager.getDevBeanEmoji();
    if (cooldown) {
      reactor.sendEmbed({
        color: 0xff9f01,
        description: `You have to wait ${cooldown} second(s) before giving another ${devBeanEmoji}`,
      });
      removeReaction(message, devBeanEmoji.id, reactor.id);
      message.react("❌");

      setTimeout(() => {
        removeReaction(message, "❌", client.id);
      }, 5000);
    }

    if (!cooldown) {
      dbh.bean.setLastDevBeanGiven(reactor.id, Date.now());
    }
  }

  if (messageReaction.isGoldenBeanReaction()) {
    console.log("detected golden bean reaction");
  }
};
