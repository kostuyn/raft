'use strict';

const EventEmitter = require('events').EventEmitter;

class Client extends EventEmitter {
    constructor(log) {
        super();

        this._log = log;
    }

    async connect() {

    }
}

module.exports = Client;
