class BeanMessenger {
  constructor(dbh, client) {
    this.dbh = dbh;
    this.client = client;
  }

  sendDevBeanNotification(sender, recipient, message) {
    recipient.send(`**${sender.tag}** has beaned your message! ${message.url}`);
  }

  sendGoldenBeanNotification(sender, recipient, message) {
    recipient.send(
      `*Wow... You got a golden bean!* **${sender.tag}** has __golden__ beaned your message! ${message.url}`
    );
  }
}

module.exports = BeanMessenger;
