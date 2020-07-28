// Item types
// Each array contains every item of a given type/quality
const commonItems = ["free role", "free nitro", "something else"];
const uncommonItems = ["twitch sub", "something else un"];
const rareItems = ["rare item 1", "rare item 2"];
const superRareItems = ["super rare 1", "super rare 2"];

//getItem(): Randomly selects an item from the given array.
//It also sends a message to itemsNotifsChannels saying who got which item
function getItem(message, p) {
  const itemNotifsChannel = message.guild.channels.cache.find(
    channel => channel.name === "item-notifs"
  );
  console.log(p);
  const itemIndex = Math.floor(Math.random() * p.length);
  console.log("index = ", itemIndex);
  const userGot = p[itemIndex];
  message.channel.send(`You got a ${userGot}`);
  itemNotifsChannel.send(`<@${message.author.id}> got a ${userGot}`);
}

// The functions intended for use in other files are declared in the module.exports object
module.exports = {
  functionOne: function(message) {
    // test function
    message.channel.send("it worked");
  },
  //openWood(): Opens a wood lootbox. Randomly selects (based on %) the quality of the item.
  openWood: function(message) {
    const num = Math.random();
    console.log("num = ", num);
    if (num > 0.75) {
      getItem(message, uncommonItems);
    } else {
      getItem(message, commonItems);
    }
  },
  //openIron(): Opens a iron lootbox. Randomly selects (based on %) the quality of the item.
  openIron: function(message) {
    const num = Math.random();
    if (num <= 0.2) {
      getItem(message, commonItems);
    } else if (num > 0.2 && num < 0.8) {
      getItem(message, uncommonItems);
    } else {
      getItem(message, rareItems);
    }
  },
  //openCopper(): Opens a copper lootbox. Randomly selects (based on %) the quality of the item.
  openCopper: function(message) {
    const num = Math.random();
    if (num <= 0.2) {
      getItem(message, uncommonItems);
    } else if (num > 0.2 && num < 0.8) {
      getItem(message, rareItems);
    } else {
      getItem(message, superRareItems);
    }
  }
};
