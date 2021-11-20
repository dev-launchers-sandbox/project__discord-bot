const OPPORTUNITYFIELDS = [
  {
    name: "title",
    collectorTime: 30 * 1000, //30 seconds
    isOptional: true,
    embed: {
      title: "━ Title ━",
      description: "Please provide a title for your opportunity.",
    },
  },
  {
    name: "description",
    collectorTime: 2 * 60 * 1000, //2 minutes
    isOptional: false,
    embed: {
      title: "━ Description ━",
      description: "Add a short description for your opportunity",
    },
  },
  {
    name: "tags",
    collectorTime: 2 * 60 * 1000, //2 minutes
    isOptional: false,
    embed: {
      title: "━ Tags ━",
      description: "Provide the tasks you want pog",
    },
  },
];

const CANCELKEYWORDS = ["cancel", "end", "exit"];
const SKIPKEYWORDS = ["skip", "next"];
const BACKKEYWORDS = ["back", "redo", "goback", "repeat"];

class Opportunity {
  constructor(user) {
    this._user = user;
    this.opportunityFieldIndex = 0;
    this.channel;
    this.opportunity = {};
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
    this.captureField(OPPORTUNITYFIELDS[this.opportunityFieldIndex]);
  }

  async captureField(field) {
    const baseEmbed = {
      color: 0xff9f01,
    };
    const { embed: customizableEmbed } = field;

    //Combine both embeds/objects into one
    const embed = {
      ...baseEmbed,
      ...customizableEmbed,
    };

    this._user.sendEmbed(embed);

    // Create messageCollector to capture the user's input, that will last for 30 seconds
    const filter = (msg) => msg.author.id === this._user.id;

    const collector = this.channel.createMessageCollector(filter, { max: 1, time: field.collectorTime });
    collector.on("collect", (collected) => {
      const content = collected.content.toLowerCase();
      if (CANCELKEYWORDS.includes(content)) return this.cancel("manual");
      if (SKIPKEYWORDS.includes(content)) return this.handleSkip(field);
      if (BACKKEYWORDS.includes(content)) return this.handleBack(field);
      this.opportunity[field.name] = collected.content;
      this.next();
    });

    collector.on("end", (collected) => {
      //After the collector ends, if no input was submitted, cancel the process
      if (collected.size === 0) {
        console.log(`In collector end for field ${field.name}. Found content of: ${collected.size}`);
        this.cancel("time");
      }
    });
  }

  next() {
    if (!(this.opportunityFieldIndex < OPPORTUNITYFIELDS.length - 1)) {
      console.log(
        `Process complete, ending after field ${OPPORTUNITYFIELDS[this.opportunityFieldIndex].name}`
      );
      this.end();
      return;
    }
    this.opportunityFieldIndex++;
    this.captureField(OPPORTUNITYFIELDS[this.opportunityFieldIndex]);
  }

  handleSkip(field) {
    if (field.isOptional) {
      this._user.sendEmbed({
        color: 0xff9f01,
        author: { name: "✅ Field successfully skipped!" },
      });
      this.next();
    } else {
      this._user.sendEmbed({
        color: 0xff9f01,
        author: { name: "This field cannot be skipped!" },
        description: `The ${field.name} field is not an optional field! Please provide the information necessary.`,
      });
      this.captureField(field);
    }
  }

  handleBack(field) {
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
      this.captureField(field);
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

  end() {
    console.log("Ending!");
    console.log(this.opportunity);
  }
}

module.exports = Opportunity;
