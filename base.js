'use strict';

class Base {
    constructor(state, entriesLog, timer, log) {
        this._state = state;
        this._entriesLog = entriesLog;
        this._timer = timer;
        this._log = log;
    }

    setManager(manager) {
        this._manager = manager;
    }

    stop() {
        this._timer.stop();
    }

    /**
     * By default returns leaderId
     * @returns {Promise}
     */
    addCmd(){
        return new Promise((resolve) => {
            resolve(this._state.leaderId);
        })
    }
}

module.exports = Base;
