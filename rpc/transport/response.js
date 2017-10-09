'use strict';

class Response {
	constructor(name, socket, protocolFactory, log) {
		this._name = name;
		this._socket = socket;
		this._protocolFactory = protocolFactory;
		this._log = log;
	}

	sendAsync({requestId, data}){
		return new Promise((resolve, reject) => {
			const buffer = this._protocolFactory.createResponse(this._name, data, requestId);

			this._socket.write(buffer, () => {
				this._socket.removeListener(resolve);
				resolve();
			});

			this._socket.once('error', resolve);
		});
	}
}

module.exports = Response;
