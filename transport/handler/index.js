'use strict';

class HandlerFactory {
	constructor(protocolFactory, log) {
		this._protocolFactory = protocolFactory;
		this._log = log;
	}

	create(socket) {
		const handler = this._protocolFactory.createHandler();
		socket.on('data', (data) => {
			handler.onData(data);
		});

		return handler;
	}
}

module.exports = HandlerFactory;
