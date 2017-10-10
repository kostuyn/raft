'use strict';

class Server {
	constructor(config, listenerFactory, net, log) {
		this._config = config;
		this._listenerFactory = listenerFactory;
		this._net = net;

		this._log = log;
	}

	listenAsync() {
		return new Promise((resolve, reject) => {
			const server = this._net.createServer();
			const serverListener = this._listenerFactory.create();

			server.on('connection', (socket) => {
				serverListener.add(socket);
			});

			server.on('error', (err) => {
				reject(err);
			});

			server.listen(this._config, () => {
				resolve(serverListener);
			});
		});
	}
}

module.exports = Server;
