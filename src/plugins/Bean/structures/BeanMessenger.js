const LINE_SEPARATOR = "\n----------------------------\n";

class BeanMessenger {
  constructor(dbh, client) {
    this.dbh = dbh;
    this.client = client;
  }

  sendDevBeanNotification(sender, recipient, message) {
    recipient.send(
      `${LINE_SEPARATOR}Someone has given you a **Dev Bean!** ${message.url}${LINE_SEPARATOR}`
    );
  }

  sendGoldenBeanNotification(sender, recipient, message) {
    recipient.send(
      `${LINE_SEPARATOR}*Wow... You got a golden bean!* Someone has **__Golden__ Beaned** your message! ${message.url}\n\n*Pay it forward and pass on your own Golden Bean by reacting to a message you love.*${LINE_SEPARATOR}`
    );
  }
}

module.exports = BeanMessenger;
