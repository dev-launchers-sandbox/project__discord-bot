const OPPORTUNITYFIELDS = [
  {
    name: "name",
    displayName: "Opportunity Name:",
    collectorTime: 30 * 1000, //30 seconds
    isOptional: false,
    characterLimit: 30,
    embed: {
      title: "━ Project Name ━",
      description: "Please provide the name of your opportunity.",
    },
  },
  {
    name: "position",
    displayName: "Position Offered:",
    collectorTime: 30 * 1000, //30 seconds
    isOptional: false,
    characterLimit: 50,
    embed: {
      title: "━ Position ━",
      description: "Provide the name of the position you are offering",
    },
  },
  {
    name: "salary",
    displayName: "Salary:",
    collectorTime: 30 * 1000, //30 seconds
    isOptional: false,
    characterLimit: 50,
    embed: {
      title: "━ Salary ━",
      description: "This doesn't have to be a number, and it can be 0.",
    },
  },
  {
    name: "description",
    displayName: "Description:",
    collectorTime: 5 * 60 * 1000, //5 minutes
    isOptional: false,
    characterLimit: 500,
    embed: {
      title: "━ Description ━",
      description: "Add a description for your opportunity (500 character limit)",
    },
  },
  {
    name: "contact",
    displayName: "Contact:",
    collectorTime: 1 * 60 * 1000, //1 minute
    isOptional: false,
    characterLimit: 100,
    embed: {
      title: "━ Contact Info ━",
      description: "How can someone contact you? Discord DMs, Gmail, etc.",
    },
  },
  {
    name: "image",
    collectorTime: 1 * 60 * 1000, //1 minute
    isOptional: true,
    characterLimit: 100,
    isImage: true,
    embed: {
      title: "━ Image ━",
      description: "[Optional] Submit a picture to be shown alongside your opportunity",
    },
  },
  {
    name: "extra",
    displayName: "Extra Information:",
    collectorTime: 2 * 60 * 1000, //2 minutes
    isOptional: true,
    characterLimit: 200,
    embed: {
      title: "━ Extra Information ━",
      description:
        "[Optional] Is there anything else you would like to say? This is the best place to do that. (200 character limit)",
    },
  },
];

const CANCELKEYWORDS = ["cancel", "end", "exit"];
const SKIPKEYWORDS = ["skip", "next", "no"];
const BACKKEYWORDS = ["back", "redo", "goback", "repeat"];

class Opportunity {
  constructor(client, user) {
    this._client = client;
    this._user = user;
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
        "The purpose of this is to create an entry in the #opportunities channel to be discovered by other server members!",
      footer: "Type cancel at any point to cancel the process!",
    });

    this.channel = refMsg.channel;
    this.createFieldCapture();
  }

  createFieldCapture() {
    if (!(this.opportunityFieldIndex < OPPORTUNITYFIELDS.length - 1)) {
      console.log(
        `Process complete, ending after field ${OPPORTUNITYFIELDS[this.opportunityFieldIndex].name}`
      );
      this.reviewOpportunity();
      return;
    }
    this.opportunityFieldIndex++;
    this.captureField(OPPORTUNITYFIELDS[this.opportunityFieldIndex], this.createFieldCapture.bind(this));
  }

  async captureField(field, callback) {
    console.log(`Caputuring field`);
    console.log(field);

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
        console.log(`In collector end for field ${field.name}. Found content of: ${collected.size}`);
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
        author: { name: "You cannot go back!" },
      });
      return this.captureField(field);
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
        author: { name: "Process cancelled!" },
        description:
          "I have cancelled the process because you took too long to answer, run the createOpportunity command to restart.",
      });
    } else {
      this._user.sendEmbed({
        color: 0xff9f01,
        author: { name: "Process successfully cancelled!" },
      });
    }
  }

  async reviewOpportunity() {
    await this.buildOpportunityEmbed();
    await this._user.sendEmbed(this.opportunityEmbed);
    const reviewMessage = await this._user.sendEmbed({
      color: 0xff9f01,
      author: { name: "3/3 Reviewing" },
      description:
        "We are almost done! I will now send you an exact copy of the embed that will be posted in the server.\n" +
        "Using the reactions, click on the field number you want to modify. Once you are happy with the result, click on the ✅\n\n" +
        "1️⃣ - Project Name\n" +
        "2️⃣ - Position Name\n" +
        "3️⃣ - Salary\n" +
        "4️⃣ - Description\n" +
        "5️⃣ - Contact Data\n" +
        "6️⃣ - Image\n" +
        "7️⃣ - Extra Information",
    });

    const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "✅"];

    //React to the message using awaits to keep them in the correct order
    for (const reaction of reactions) {
      await reviewMessage.react(reaction);
    }

    const filter = (reaction, user) =>
      reactions.includes(reaction.emoji.name) && user.id === this._user.id;

    const userResponse = await reviewMessage
      .awaitReactions(filter, { time: 15000, max: 1 })
      .catch(console.error);
    const emoji = userResponse.entries().next().value[0];

    if (emoji === "✅") {
      return this.postIntroduction();
    }

    this.opportunityFieldIndex = reactions.indexOf(emoji);
    console.log(this.opportunityFieldIndex);
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
    embed.timestamp = Date.now();
    embed.fields = [{ name: "Submitted By:", value: this._user.toString() }];
    embed.fields = [
      ...embed.fields,
      ...filledFields.map((field) => {
        const fieldInput = this.opportunity[field.name];
        return { name: field.displayName, value: fieldInput };
      }),
    ];
    embed.footer = { image: this._client.user.displayAvatarURL(), text: " | Dev Launchers" };
    this.opportunityEmbed = embed;
  }

  postIntroduction() {
    this._user.send("All done here!");
    this.buildOpportunityEmbed();
    const guild = this._client.guilds.cache.get("711687367081328752");
    guild.channels.cache.get("892088080775909406").sendEmbed(this.opportunityEmbed);
  }
}

module.exports = Opportunity;
