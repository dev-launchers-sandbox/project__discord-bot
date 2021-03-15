class NitroEnginePart {
  constructor(type) {
    this._type = type;
  }

  getType() {
    return this._type;
  }

  destroy() {}
}

module.exports = NitroEnginePart;
