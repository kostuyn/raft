'use strict';

const uuid = require('uuid/v4');

const {EventEmitter} = require('events');

class ServerListener extends EventEmitter {
	constructor(protocolFactory, responseFactory, log) {
		this._protocolFactory = protocolFactory;
		this._responseFactory = responseFactory;
		this._log = log;

		this._sockets = {};
	}

	add(socket) {
		//socket.unref();

		// TODO: need clientId & this._sockets ?? array for close all, gracefully shutdown ??
		const clientId = uuid();

		const response = this._responseFactory.create(name, socket);
		const handler = this._protocolFactory.createHandler();

		this._sockets[clientId] = socket;
		socket.on('data', (data) => {
			handler.onData(data);
		});

		socket.on('error', (e) => {
			this._log.error(e);
			delete this._sockets[clientId];
		});
		
		handler.on('request', ({id, name, data}) => {			
			this.emit(name, {
				requestId: id,
				msg: data,
				res: response
			});
		});		
	}
}

module.exports = ServerListener;
