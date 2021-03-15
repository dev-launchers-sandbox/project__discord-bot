// Gives a random Nitro Engine Part when opened

const NitroEnginePart = require("./NitroEnginePart.js");

const partTypes = [
  "Combustion Chamber",
  "Carburetor",
  "Piston",
  "Cylinder",
  "Exhaust",
];

class PartBox {
  constructor() {}

  getRandomPartType() {
    return partTypes[parseInt(Math.random() * partTypes.length)];
  }

  open() {
    return new NitroEnginePart(this.getRandomPartType());
  }

  destroy() {}
}

module.exports = PartBox;
