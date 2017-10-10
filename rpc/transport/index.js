'use strict';

const net = require('net');

const Server = require('./server');
const Client = require('./client');
const ListenerFactory = require('./server_listener');
const HandlerFactory = require('./handler');
const ResponseFactory = require('./response');

exports.createServer = function (config, protocolFactory, log) {
	const responseFactory = new ResponseFactory(protocolFactory, log);
	const handlerFactory = new HandlerFactory(protocolFactory, log);
	const listenerFactory = new ListenerFactory(handlerFactory, responseFactory, log);
	return new Server(config, listenerFactory, net, log);
};

exports.createClient = function (config, protocolFactory, log) {
	return new Client(config, protocolFactory, net, log);
};
