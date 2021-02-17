class Task {
    constructor(execute, interval) {
        this._execute = execute;
        this._interval = interval;

        this._executionTime = 0;
    }

    checkExecution() {
        if (new Date().getTime() - this._executionTime > this._interval)
            this.execute();
    }

    execute() {
        this._execute();

        this._executionTime = new Date().getTime();
    }
}

module.exports = Task;