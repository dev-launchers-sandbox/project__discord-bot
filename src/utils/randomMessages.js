const getRandomMessage = (message, randomMessages) => {
  let randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
  let modifiedMessage = randomMessage.replace("MESSAGE_LINK", message.url);
  return modifiedMessage;
};

module.exports = { getRandomMessage };
