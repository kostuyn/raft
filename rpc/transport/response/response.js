'use strict';

class Response {
	constructor(name, socket, protocolFactory, log) {
		this._name = name;
		this._socket = socket;
		this._protocolFactory = protocolFactory;
		this._log = log;
	}

	sendAsync(requestId, reply) {
		return new Promise((resolve, reject) => {
			const buffer = this._protocolFactory.createResponse(this._name, reply, requestId);

			this._socket.write(buffer, () => {
				this._socket.removeListener('error', resolve);
				this._socket.removeListener('end', resolve);
				resolve();
			});

			this._socket.once('error', resolve);
			this._socket.once('end', resolve);
		});
	}
}

module.exports = Response;
