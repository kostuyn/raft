'use strict';

const uuid = ('uuid/v4');
const EventEmitter = require('events').EventEmitter;
const Protocol = require('./protocol');

class Server extends EventEmitter {
	constructor(config, net, protocol, log) {
		super();

		this._config = config;
		this._net = net;
		this._protocol = protocol;
		this._log = log;
		this._sockets = {};
		this._protocols = {};
	}

	listenAsync() {
		this._protocol.on(Protocol.REQUEST, (msg) => {
			this.emit(msg.name, msg);
		});
		
		return new Promise((resolve, reject) => {
			const server = this._net.createServer((socket) => {
				const protocol = new Protocol(uuid);
				const id = uuid();
				
				protocol.on(Protocol.REQUEST, (msg) => {
					this.emit(msg.name, {msg, id});
				});
				
				socket.on('data', (data) => {
					protocol.onData(data);
				});
				
				socket.on('error', (e) =>{
					this._log.error(e);
					delete this._sockets[id];	
				});
				
				this._sockets[id] = socket;
			});

			server.on('error', (err) => {
				reject(err);
			});

			server.listen(this._config, () => {
				resolve();
			});
		});
	}

	responseAsync(name, {id, response}) {
		return new Promise((resolve, reject) => {
			// TODO: move to other class ??
			const data = this._protocol.getData(Protocol.RESPONSE, name, response, id);

			// check if not delete after socket error
			this._sockets[id] || this._sockets[id].write(data.buffer, () => {
				resolve(data);
			});
		});
	}
}

module.exports = Server;
