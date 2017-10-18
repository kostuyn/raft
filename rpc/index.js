'use strict';

const transport = require('../transport');
const protocol = require('../protocol');

const Node = require('../node');
const ServerRunner = require('../server_runner');

exports.createNode = function (config, log) {
	const protocolFactory = protocol.createFactory(log);
	const client = transport.createClient(config, protocolFactory, log);

	return new Node(client, log);
};

exports.createRunner = function (config, manager, log) {
	const protocolFactory = protocol.createFactory(log);
	const server = transport.createServer(config, protocolFactory, log);

	return new ServerRunner(manager, server, log);
};
