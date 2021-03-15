class NitroEnginePartDropper {
  constructor(dbh, client) {
    this._dbh = dbh;
    this._client = client;
  }

  dropRandomPart(channel) {
    let embed = channel
      .sendEmbed({
        //author: user.id,
        color: 0x0077dd,
        title: "⚙ NITRO ENGINE PART DROP!",
        description: "Be the first to click the 📦 to claim this part",
        //description: reminderDate,
        footer: "Collect parts for Discord Nitro!",
      })
      .then((embed) => {
        embed.react("📦");
      });
  }

  destroy() {}
}

module.exports = NitroEnginePartDropper;
