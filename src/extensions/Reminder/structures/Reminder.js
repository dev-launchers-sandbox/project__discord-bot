class Reminder {
    constructor(dbh, client, channel, userId, body, date, sentAt) {
        this._dbh = dbh;
        this._client = client;
        this._channel = channel;
        this._userId = userId;
        this._body = body;
        this._date = date;
        this._sentAt = sentAt;
    }

    getBody() {
        return this._body;
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
        let channel = await this._client.channels
            .fetch(this._channel.id)
            .then((channel) => channel);

        let user = this._client.users.cache.get(this._userId); // Getting the user by ID.

        channel.send(user.toString());
        channel.sendEmbed({
            //author: this._userId,
            author: { name: "📜 Reminder" },
            title: this._body,
            //description: this._date,
            footer: "Set by " + user.username,
            color: "#f7d7c4",
        });
        this.destroy();
    }

    destroy() {
        this._dbh.reminder.removeReminder(this);
    }
}

module.exports = Reminder;