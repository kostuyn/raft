'use strict';

const uuid = require('uuid/v4');
const {EventEmitter} = require('events');

class Server extends EventEmitter {
	constructor(config, net, protocolFactory, log) {
		super();

		this._config = config;
		this._net = net;
		this._protocolFactory = protocolFactory;
		this._log = log;
		this._sockets = {};

		this._connections = connectoins;
	}

	listenAsync() {
		return new Promise((resolve, reject) => {
			const server = this._net.createServer();
			const serverListener = this._listenerFactory.create();
			
			server.on('connection', (socket) => {
				serverListener.add(socket);

				// const handler = this._protocolFactory.createHandler();
				// const clientId = uuid();
				//
				// handler.on('request', ({id, name, data}) => {
				// 	this.emit(name, {requestId: id, data, clientId});
				// });
				//
				// socket.on('data', (data) => {
				// 	handler.onData(data);
				// });
				//
				// socket.on('error', (e) => {
				// 	this._log.error(e);
				// 	delete this._sockets[clientId];
				// });
				//
				// this._sockets[clientId] = socket;
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
