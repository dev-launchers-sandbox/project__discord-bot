// Active row anti-pattern? Ugh whatever

const ENGINE_ITEM_SCHEMA = { type: "Engine", fuel: 0 };

class EngineInventory {
  constructor(dbh, client, userId) {
    this._dbh = dbh;
    this._client = client;
    this._userId = userId;

    this._items = this.fetchData();
  }

  getUserId() {
    return this._userId;
  }

  getEngines() {
    return this._items;
  }

  fetchData() {
    let items = this._dbh.nitroEngine.getUserEngines(this._userId);
    if (!items) return this._dbh.nitroEngine.enginesSchemaSeed(); // return fresh copy of inventory data
    return items;
  }

  addEngine() {
    this._items.push(ENGINE_ITEM_SCHEMA);
    this.save();
  }

  removeEngine() {
    this._items.splice(0, 1);
    this.save();
  }

  save() {
    this._dbh.nitroEngine.setUserEngines(this._userId, this._items);
  }

  destroy() {}
}

module.exports = EngineInventory;
