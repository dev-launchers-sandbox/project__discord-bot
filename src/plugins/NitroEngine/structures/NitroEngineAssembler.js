const NitroEngine = require("./NitroEngine.js");

class NitroEngineAssembler {
  constructor(dbh, client) {
    this._dbh = dbh;
    this._client = client;
  }

  canAssembleEngine(partInventory) {
    let canAssemble = true;
    partInventory
      .getItems()
      .forEach(
        (itemEntry) =>
          (canAssemble = canAssemble && itemEntry.amount > 0 ? true : false)
      );
    return canAssemble;
  }

  assembleEngine(partInventory, engineInventory) {
    if (this.canAssembleEngine(partInventory)) {
      partInventory.decrementAllAmounts();
      engineInventory.addEngine();
      return new NitroEngine();
    }
    return null;
  }

  getType() {
    return this._type;
  }

  destroy() {}
}

module.exports = NitroEngineAssembler;
