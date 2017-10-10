'use strict';

const uuid = require('uuid/v4');

const {EventEmitter} = require('events');

class ServerListener extends EventEmitter {
	constructor(handlerFactory, responseFactory, log) {
		super();

		this._handlerFactory = handlerFactory;
		this._responseFactory = responseFactory;
		this._log = log;

		this._sockets = {};
	}

	add(socket) {
		const clientId = uuid();
		const handler = this._handlerFactory.create(socket);

		this._sockets[clientId] = socket;

		socket.once('error', (e) => {
			this._log.error(e);
			delete this._sockets[clientId];
		});

		socket.once('end', () => {
			delete this._sockets[clientId];
		});

		handler.on('request', ({requestId, name, msg}) => {
			const res = this._responseFactory.create(name, socket);
			this.emit(name, {
				requestId,
				msg,
				res
			});
		});
	}
}

module.exports = ServerListener;
