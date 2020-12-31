const Task = require("./Task.js");

const unixTime = () => {
  return new Date().getTime();
};

class TaskManager {
  constructor() {
    console.log("TaskManager created");
    this._tasks = [];

    this._intervalFunc = setInterval(() => {
      this.tick();
    }, 1000);
  }

  addTask(toExecute, interval) {
    let task = new Task(toExecute, interval);

    this._tasks.push(task);
  }

  removeTask(toExecute) {
    const index = this._tasks.indexOf(toExecute);
    if (index != -1) this._tasks.splice(index, 1);
  }

  tick() {
    console.log("tick");
    for (let i = 0; i < this._tasks.length; i++) {
      let task = this._tasks[i];
      task.checkExecution();
    }
  }
}

module.exports = TaskManager;
