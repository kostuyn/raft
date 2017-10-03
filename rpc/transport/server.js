'use strict';

const EventEmitter = require('events').EventEmitter;

class Server extends EventEmitter {
    constructor(config, net, protocol, log) {
        super();

        this._config = config;
        this._net = net;
        this._protocol = protocol;
        this._log = log;
    }

    async listen() {
        return new Promise((resolve, reject) => {
            const server = this._net.createServer(this._config, (socket) => {
                this._socket = socket;
                resolve();
            });

	        server.on('error', (err) => {
		        reject(err);
	        });
        });
    }
}

module.exports = Server;
