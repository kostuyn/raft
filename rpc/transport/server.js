'use strict';

const EventEmitter = require('events').EventEmitter;

class Server extends EventEmitter {
    constructor(config, log) {
        super();
        
        this._config = config;
        this._log = log;
    }

    async listen() {

    }
}

module.exports = Server;
