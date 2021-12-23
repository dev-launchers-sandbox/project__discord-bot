class Utilities {
  constructor() {}

  //time: Duration of the delay (int)
  //playTypingAnimation: Whether the bot will be "typing" during the delay (boolean)
  //channel: required if playTypingAnimation is true. The channel the bot will "type" in
  async wait(time = 5 * 1000, playTypingAnimation = false, channel) {
    if (playTypingAnimation) channel.startTyping();
    await new Promise((resolve) => {
      setTimeout(() => {
        if (playTypingAnimation) channel.stopTyping(1);
        resolve();
      }, time);
    });
  }
}

module.exports = new Utilities();
