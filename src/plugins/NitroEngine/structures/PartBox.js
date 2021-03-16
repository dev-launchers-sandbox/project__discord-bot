// Gives a random Nitro Engine Part when opened

const NitroEnginePart = require("./NitroEnginePart.js");

const DROP_TABLE = [
  { type: "Fuel", dropWeight: 100 },
  { type: "Combustion Chamber", dropWeight: 20 },
  { type: "Carburetor", dropWeight: 20 },
  { type: "Piston", dropWeight: 20 },
  { type: "Cylinder", dropWeight: 20 },
  { type: "Exhaust", dropWeight: 20 },
];

class PartBox {
  constructor() {}

  getRandomPartType() {
    let cumulativeSum = 0;
    let cumulativeValues = [];
    DROP_TABLE.forEach((entry) => {
      cumulativeSum += entry.dropWeight;
      cumulativeValues.push(cumulativeSum);
    });
    let randNum = parseInt(Math.random() * cumulativeSum);
    let index = -1;
    for (let i = 0; i < cumulativeValues.length; i++) {
      if (randNum < cumulativeValues[i]) {
        index = i;
        break;
      }
    }

    return DROP_TABLE[index].type;
  }

  open() {
    return new NitroEnginePart(this.getRandomPartType());
  }

  destroy() {}
}

module.exports = PartBox;
