'use strict';

class Client {
    constructor(config, net, protocol, log) {
        this._config = config;
	    this._net = net;
	    this._protocol = protocol;
        this._log = log;
    }

    async connect() {
	    return new Promise((resolve, reject) => {
		    this._socket = this._net.createConnection(this._config, () => {
				resolve();
		    });

		    this._socket.on('error', (err) => {
			    reject(err);
		    });
	    });
    }
}

module.exports = Client;
