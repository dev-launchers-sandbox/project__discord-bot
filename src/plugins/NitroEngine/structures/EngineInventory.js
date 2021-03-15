// Active row anti-pattern? Ugh whatever

class EngineInventory {
  constructor(dbh, client, userId) {
    this._dbh = dbh;
    this._client = client;
    this._userId = userId;

    this._numEngines = this.fetchData();
  }

  getUserId() {
    return this._userId;
  }

  getNumEngines() {
    return this._numEngines;
  }

  fetchData() {
    let numEngines = this._dbh.nitroEngine.getUserEngines(this._userId);
    if (!numEngines) return this._dbh.nitroEngine.enginesSchemaSeed(); // return fresh copy of inventory data
    return numEngines;
  }

  addEngine() {
    this._numEngines++;
    this.save();
  }

  removeEngine() {
    this._numEngines--;
    this.save();
  }

  save() {
    this._dbh.nitroEngine.setUserEngines(this._userId, this._numEngines);
  }

  destroy() {}
}

module.exports = EngineInventory;
