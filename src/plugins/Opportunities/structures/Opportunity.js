const { wait } = require("./../../.common/structures/Utilities/Utilities.js");
const dbh = require("./../../.common/structures/DataHandling/DatabaseHandler.js");

const OPPORTUNITYFIELDS = [
  {
    name: "name",
    displayName: "Opportunity Name:",
    collectorTime: 45 * 1000, //45 seconds
    isOptional: false,
    characterLimit: 30,
    embed: {
      author: { name: "Opportunity Name:" },
    },
  },
  {
    name: "position",
    displayName: "Position Offered:",
    collectorTime: 45 * 1000, //45 seconds
    isOptional: false,
    characterLimit: 50,
    embed: {
      author: { name: "Position Offered:" },
    },
  },
  {
    name: "pay",
    displayName: "Pay:",
    collectorTime: 45 * 1000, //30 seconds
    isOptional: true,
    characterLimit: 50,
    embed: {
      author: { name: "Pay:" },
      footer: "[Optional] Not all opportunities will offer a pay",
    },
  },
  {
    name: "description",
    displayName: "Description:",
    collectorTime: 5 * 60 * 1000, //5 minutes
    isOptional: false,
    characterLimit: 500,
    embed: {
      author: { name: "Description:" },
    },
  },
  {
    name: "contact",
    displayName: "Contact Info:",
    collectorTime: 5 * 60 * 1000, //5 minutes
    isOptional: false,
    characterLimit: 200,
    embed: {
      author: { name: "Contact Info:" },
    },
  },
  {
    name: "image",
    collectorTime: 3 * 60 * 1000, //3 minutes
    isOptional: true,
    characterLimit: 100,
    isImage: true,
    embed: {
      author: { name: "Image:" },
      footer: "[Optional] Submit a picture to be shown alongside your opportunity",
    },
  },
  {
    name: "extra",
    displayName: "Extra Information:",
    collectorTime: 5 * 60 * 1000, //5 minutes
    isOptional: true,
    characterLimit: 200,
    embed: {
      author: { name: "Extra Information: " },
      description:
        "[Optional] For any extra information about your opportunity that is valuable to other members",
    },
  },
];

const CANCELKEYWORDS = ["cancel", "end", "exit"];
const SKIPKEYWORDS = ["skip", "next", "no"];
const BACKKEYWORDS = ["back", "redo", "goback", "repeat"];

class Opportunity {
  constructor(client, user, guild) {
    this._client = client;
    this._user = user;
    this._guild = guild;
    this.opportunityFieldIndex = -1;
    this.channel;
    this.opportunity = {};
    this.opportunityEmbed;
  }

  async createOpportunity() {
    const refMsg = await this._user.sendEmbed({
      color: 0xff9f01,
      author: { name: "Welcome to the opportunity creation guide!" },
      description:
        "**❗ IMPORTANT**\nRun the `createOpportunity` command before running this command to understand opportunities and the creation process!\n\n" +
        "Click on the ✅ to start the Opportunity Creation Guide. Click on the ❌ to cancel the process",
    });

    this.channel = refMsg.channel;
    await refMsg.react("✅");
    await refMsg.react("❌");

    const filter = (reaction, user) =>
      ["✅", "❌"].includes(reaction.emoji.name) && user.id === this._user.id;

    const userResponse = await refMsg
      .awaitReactions(filter, { time: 60 * 1000, max: 1 })
      .catch(console.error);

    //To prevent the reaction collector from being open to long, we cancel the process if the user hasn't responded
    if (userResponse.size === 0) {
      return this.cancel();
    }

    const emoji = userResponse.entries().next().value[0];
    if (emoji === "✅") {
      //We generate a random waitTime between 1000 (1s) and 2000 (2s) to keep the wait time random, and less repetitive.
      const waitTime = Math.floor(Math.random() * (1000 + 1) + 1000);
      await wait(waitTime, true, this.channel);

      this.createFieldCapture();
    } else this.cancel();
  }

  async createFieldCapture() {
    if (!(this.opportunityFieldIndex < OPPORTUNITYFIELDS.length - 1)) {
      this.reviewOpportunity();
      return;
    }

    this.opportunityFieldIndex++;
    this.captureField(OPPORTUNITYFIELDS[this.opportunityFieldIndex], this.createFieldCapture.bind(this));
  }

  async captureField(field, callback) {
    //We generate a random waitTime between 1000 (1s) and 2000 (2s) to keep the wait time random, and less repetitive.
    const waitTime = Math.floor(Math.random() * (1000 + 1) + 1000);
    await wait(waitTime, true, this.channel);

    const baseEmbed = {
      color: 0xff9f01,
    };
    const { embed: customizableEmbed } = field;

    //Combine both embeds/objects into one
    const embed = {
      ...baseEmbed,
      ...customizableEmbed,
    };

    //Send the embed asking the user to post the information
    this._user.sendEmbed(embed);

    //Create messageCollector to capture the user's input, that will last for 30 seconds
    const filter = (msg) => msg.author.id === this._user.id;

    const collector = this.channel.createMessageCollector(filter, { max: 1, time: field.collectorTime });

    collector.on("collect", (collected) => {
      const content = collected.content.toLowerCase();
      //Check for special cases
      if (CANCELKEYWORDS.includes(content)) return this.cancel("manual");
      if (SKIPKEYWORDS.includes(content)) return this.handleSkip(field, callback);
      if (BACKKEYWORDS.includes(content)) return this.handleBack(field, callback);

      //Check if the field is an image, as capturing the image is different from regular text
      if (field.isImage) this.captureImage(field, collected, callback);
      else {
        if (content.length > field.characterLimit) {
          this._user.sendEmbed({
            color: 0xff9f01,
            description: `This field has a character limit of ${field.characterLimit}. Please try again`,
          });
          return this.captureField(field, callback);
        }
        this.opportunity[field.name] = collected.content;
        callback();
      }
    });

    collector.on("end", (collected) => {
      //After the collector ends, if no input was submitted, cancel the process
      if (collected.size === 0) {
        this.cancel("time");
      }
    });
  }

  captureImage(field, collected, callback) {
    const attachment = collected.attachments.first();
    if (!attachment) {
      this._user.sendEmbed({
        color: 0xff9f01,
        description: "I could not find an image! If you want to skip this field, please type *skip*",
      });
      return this.captureField(field, callback);
    }
    this.opportunity[field.name] = attachment.url;
    callback();
  }

  handleSkip(field, callback) {
    if (field.isOptional) {
      /*
      In the review process, this (↓) allows users to "clear" the data by skipping.
      Without it, it wouldn't overwrite the data with the skip
      */
      if (this.opportunity[field.name] !== undefined) this.opportunity[field.name] = undefined;

      this._user.sendEmbed({
        color: 0xff9f01,
        author: { name: "✅ Field successfully skipped!" },
      });
      callback();
    } else {
      this._user.sendEmbed({
        color: 0xff9f01,
        author: { name: "This field cannot be skipped!" },
        description: `The ${field.name} field is not an optional field! Please provide the information necessary.`,
      });
      this.captureField(field, callback);
    }
  }

  handleBack(field, callback) {
    if (this.opportunityFieldIndex === 0) {
      this._user.sendEmbed({
        color: 0xff9f01,
        description: "You cannot go back! Don't try to trick me 🙃",
      });
      return this.captureField(field, callback);
    } else {
      this.opportunityFieldIndex--;
      const field = OPPORTUNITYFIELDS[this.opportunityFieldIndex];
      this.opportunity[field.name] = null; //clear data;
      this.captureField(field, callback);
    }
  }
  cancel(reason) {
    if (reason === "time") {
      this._user.sendEmbed({
        color: 0xff9f01,
        author: { name: "❗ Process cancelled!" },
        description:
          "The Opportunity Creation Guide has been canceled because you took to long to answer! Run the `startOpportunity` command to restart the process",
      });
    } else {
      this._user.sendEmbed({
        color: 0xff9f01,
        author: { name: "✅ The Opportunity Creation Guide has been successfully canceled." },
      });
    }
  }

  async reviewOpportunity() {
    //We generate a random waitTime between 1000 (1s) and 2000 (2s) to keep the wait time random, and less repetitive.
    let waitTime = Math.floor(Math.random() * (1000 + 1) + 1000);
    await wait(waitTime, true, this.channel);

    const reviewMessage = await this._user.sendEmbed({
      color: 0xff9f01,
      author: { name: "Review Your Opportunity" },
      description:
        "We are almost done! Here is what I got from you.\n" +
        "Using the reactions, click on the field number you want to modify. Once you are happy with the result, click on the ✅\n\n" +
        `1️⃣ - **Project Name:** ${this.opportunity.name}\n\n` +
        `2️⃣ - **Position Name:** ${this.opportunity.position}\n\n` +
        `3️⃣ - **Pay:** ${this.opportunity.pay || "*skipped*"}\n\n` +
        `4️⃣ - **Description:** ${this.opportunity.description}\n\n` +
        `5️⃣ - **Contact Data:** ${this.opportunity.contact}\n\n` +
        `6️⃣ - **Image:** ${this.opportunity.image ? "☑️" : "*skipped*"}\n\n` +
        `7️⃣ - **Extra Information:** ${this.opportunity.extra || "*skipped*"}\n\n`,
    });

    const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "✅"];

    //React to the message using awaits to keep them in the correct order
    for (const reaction of reactions) {
      await reviewMessage.react(reaction);
    }

    const filter = (reaction, user) =>
      reactions.includes(reaction.emoji.name) && user.id === this._user.id;

    const userResponse = await reviewMessage
      .awaitReactions(filter, { time: 60 * 1000, max: 1 })
      .catch(console.error);

    if (userResponse.size === 0) {
      return this.cancel("time");
    }

    const emoji = userResponse.entries().next().value[0];

    if (emoji === "✅") {
      return this.postIntroduction();
    }

    this.opportunityFieldIndex = reactions.indexOf(emoji);
    this.captureField(OPPORTUNITYFIELDS[this.opportunityFieldIndex], this.reviewOpportunity.bind(this));
  }

  buildOpportunityEmbed() {
    let embed = {
      color: 0xff9f01,
      title: `━ ${this.opportunity.name} ━`,
    };
    const filledFields = OPPORTUNITYFIELDS.filter(
      (field) => this.opportunity[field.name] && !field.isImage
    );

    embed.image = this.opportunity.image;
    embed.fields = [{ name: "Submitted By:", value: this._user.toString() }];
    embed.fields = [
      ...embed.fields,
      ...filledFields.map((field) => {
        const fieldInput = this.opportunity[field.name];
        return { name: field.displayName, value: fieldInput };
      }),
    ];
    //TODO: Import prefix!
    embed.footer = {
      image: this._client.user.displayAvatarURL(),
      text: " | Run the .createOpportunity command to create YOUR opportunity now!",
    };
    this.opportunityEmbed = embed;
  }

  async postIntroduction() {
    this.buildOpportunityEmbed();

    const opportunityChannelId = await dbh.channels.getOpportunity(this._guild.id);
    const opportunityChannel = this._guild.channels.resolve(opportunityChannelId);
    const opportunityMsg = await opportunityChannel.sendEmbed(this.opportunityEmbed);

    this._user.sendEmbed({
      color: 0xff9f01,
      title: "Opportunity",
      description: `The opportunity has been posted!`,
      url: opportunityMsg.url,
    });
  }
}

module.exports = Opportunity;
