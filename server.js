'use strict';

const EventEmitter = require('events').EventEmitter;

class Server extends EventEmitter {
    constructor(log) {
        super();

        this._log = log;
    }

    async listen() {

    }
}

module.exports = Server;
