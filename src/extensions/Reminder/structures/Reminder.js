class Reminder {
  constructor(client, channel, userId, body, date) {
    this._client = client;
    this._channel = channel;
    this._userId = userId;
    this._body = body;
    this._date = date;
  }

  isOverdue() {
    const time = new Date().getTime();
    const reminderTime = new Date(this._date).getTime();
    if (time > reminderTime) {
      return true;
    }
    return false;
  }

  checkReminderDate() {
    if (this.isOverdue()) {
      this.send();
    }
  }

  async send() {
    console.log("sending!");
    console.log(this._channel);

    let channel = await this._client.channels
      .fetch(this._channel.id)
      .then((channel) => channel);
    console.log(channel);

    channel.sendEmbed({
      author: this._userId,
      title: this._body,
      description: this._date,
      footer: this._channel,
    });
    this.destroy();
  }

  destroy() {
    dbh.reminder.removeReminder(this);
  }
}
