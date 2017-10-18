'use strict';

const Server = require('./server');
const Client = require('./client');
const ListenerFactory = require('./server_listener/index');
const HandlerFactory = require('./handler/index');
const ResponseFactory = require('./response/index');

class TransportFactory {
	constructor(protocolFactory, net, log) {
		this._protocolFactory = protocolFactory;
		this._net = net;
		this._log = log;
	}

	createServer(config) {
		const responseFactory = new ResponseFactory(this._protocolFactory, this._log);
		const handlerFactory = new HandlerFactory(this._protocolFactory, this._log);
		const listenerFactory = new ListenerFactory(handlerFactory, responseFactory, this._log);
		return new Server(config, listenerFactory, this._net, this._log);
	};

	createClient(config) {
		return new Client(config, this._protocolFactory, this._net, this._log);
	};
}

exports.createFactory = function(protocolFactory, net, log){
	return new TransportFactory(protocolFactory, net, log);
};
