'use strict';

const ServerListener = require('./server_listener');

class ListenerFactory {
	constructor(handlerFactory, responseFactory, log) {
		this._handlerFactory = handlerFactory;
		this._responseFactory = responseFactory;
		this._log = log;
	}

	create() {
		return new ServerListener(this._handlerFactory, this._responseFactory, this._log);
	}
}

module.exports = ListenerFactory;
