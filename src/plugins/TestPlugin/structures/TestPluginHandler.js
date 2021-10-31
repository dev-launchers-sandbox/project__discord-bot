class TestPluginHandler {
  constructor(start, interval) {
    this.count = start;
    this.interval = interval;
  }

  getCount() {
    return this.count;
  }

  addInterval() {
    this.count += this.interval;
  }
}

module.exports = TestPluginHandler;
