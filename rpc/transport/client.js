'use strict';

class Client {
	constructor(config, protocolFactory, net, log) {
		this._config = config;
		this._protocolFactory = protocolFactory;
		this._net = net;

		this._log = log;
	}

	async connectAsync() {
		this._handler = this._protocolFactory.createHandler();

		return new Promise((resolve, reject) => {
			this._initId();

			this._socket = this._net.createConnection(this._config, () => {
				resolve();
			});

			this._socket.on('data', (data) => {
				this._handler.onData(data);
			});

			this._socket.on('error', (err) => {
				reject(err);
			});
		});
	}

	sendAsync(name, msg) {
		return new Promise((resolve, reject) => {
			const requestId = this._getId();

			this._handler.once(requestId, ({data}) => {
				resolve(data);
			});

			const data = this._protocolFactory.createRequest(name, msg, requestId);
			this._socket.write(data);

			this._socket.on('error', (err) => {
				reject(err);
			});
		});

	}

	closeAsync() {

	}

	_initId() {
		this._id = (new Uint32Array(1));
	}

	_getId() {
		return this._id[0]++;
	}
}

module.exports = Client;
