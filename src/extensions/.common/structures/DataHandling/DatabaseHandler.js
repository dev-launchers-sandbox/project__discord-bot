const quickDB = require("quick.db");

class DatabaseHandler {
    constructor() {
        this.bean = new BeanHandler();
        this.reminder = new ReminderHandler();
        this.invite = new InviteHandler();
    }
}

class BeanHandler {
    constructor() {}

    getUserDevBeans(id) {
        return quickDB.get(`account.${id}.devBeans`);
    }

    getUserGoldenBeans(id) {
        return quickDB.get(`account.${id}.goldenBeans`);
    }

    getUserForeverDevBeans(id) {
        return quickDB.get(`account.${id}.foreverDevBeans`);
    }

    getUserForeverGoldenBeans(id) {
        return quickDB.get(`account.${id}.foreverGoldenBeans`);
    }
}

class ReminderHandler {
    constructor() {}

    getReminders() {
        return quickDB.get(`reminders`);
    }

    addReminder(reminder) {
        quickDB.push(`reminders`, reminder);
    }

    removeReminder(reminder) {
        let reminders = this.getReminders();
        let filtered = reminders.filter((entry) => {
            return !(
                entry.sentAt === reminder._sentAt && entry.userId === reminder._userId
            );
        });
        this.setReminders(filtered);
    }

    setReminders(reminders) {
        quickDB.set(`reminders`, reminders);
        return reminders;
    }

    getUserReminders(user) {
        return quickDB.get(`reminders`).filter((entry) => {
            return entry.userId == user.id;
        });
    }

    popUserReminder(user) {
        // Using global stack to emulate individual user stacks
        let reminders = this.getReminders();
        let reminder;
        for (let i = reminders.length - 1; i >= 0; i--) {
            if (user.id == reminders[i].userId) {
                console.log("FOUND REMINDER");
                reminder = reminders.splice(i, 1)[0];
                break;
            }
        }
        this.setReminders(reminders);
        return reminder;
    }

    clearReminders() {
        quickDB.set(`reminders`, []);
    }
}

class InviteHandler {
    constructor() {}

    setInvite(guildId, name, code) {
        quickDB.set(`invites.${guildId}.${name}`, code);
    }

    getInvites(guildId) {
        return quickDB.get(`invites.${guildId}`);
    }

    getInvite(guildId, name) {
        return quickDB.get(`invites.${guildId}.${name}`);
    }

    removeInvite(guildId, name) {
        quickDB.delete(`invites.${guildId}.${name}`);
    }

    getInviteChannel(guildId) {
        return quickDB.get(`invite.${guildId}`);
    }
}

module.exports = new DatabaseHandler();