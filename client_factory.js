'use strict';

const Client = require('./client');

class ClientFactory {
    constructor(log) {
        this._log = log;
    }

    create() {
        return new Client(this._log);
    }
}

module.exports = ClientFactory;
