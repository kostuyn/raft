'use strict';

const transportFactory = require('./transport');

const ProtocolFactory = require('./protocol');

const Node = require('./node');
const ServerRunner = require('./server_runner');

exports.createNode = function (config, log) {
	const protocolFactory = new ProtocolFactory(log);
	const client = transportFactory.createClient(config, protocolFactory, log);

	return new Node(client, log);
};

exports.createRunner = function (config, manager, log) {
	const protocolFactory = new ProtocolFactory(log);
	const server = transportFactory.createServer(config, protocolFactory, log);

	return new ServerRunner(manager, server, log);
};
