// Active row anti-pattern? Ugh whatever

class PartInventory {
  constructor(dbh, client, userId) {
    this._dbh = dbh;
    this._client = client;
    this._userId = userId;

    this._items = this.fetchData();
  }

  getUserId() {
    return this._userId;
  }

  getItems() {
    return this._items;
  }

  fetchData() {
    let inventory = this._dbh.nitroEngine.getUserInventory(this._userId);
    if (!inventory) return this._dbh.nitroEngine.inventorySchemaSeed(); // return fresh copy of inventory data
    return inventory;
  }

  checkPartExistsByType(partType) {
    return !!this._items.filter(
      (entry) => entry.type === partType && entry.amount > 0
    ).length;
  }

  addPartByType(partType) {
    this._items = this._items.map((itemEntry) => {
      if (itemEntry.type == partType) itemEntry.amount++;
      return itemEntry;
    });
    this.save();
  }

  removePartByType(partType) {
    if (this.checkPartExistsByType(partType)) {
      this._items = this._items.map((itemEntry) => {
        if (itemEntry.type == partType) itemEntry.amount--;
        return itemEntry;
      });
      this.save();
    }
  }

  addPart(nitroEnginePart) {
    this.addPartByType(nitroEnginePart.type);
  }

  decrementAllAmounts() {
    this._items = this._items.map((itemEntry) => ({
      ...itemEntry,
      amount: itemEntry.amount - 1,
    }));
    this.save();
  }

  save() {
    this._dbh.nitroEngine.setUserInventory(this._userId, this._items);
  }

  destroy() {}
}

module.exports = PartInventory;
