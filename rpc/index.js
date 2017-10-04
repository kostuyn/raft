'use strict';

const uuid = require('uuid/v4');
const net = require('net');

const Client = require('./transport/client');
const Server = require('./transport/server');
const ProtocolFactory = require('./protocol');

const Node = require('./node');
const ServerRunner  = require('./server_runner');

exports.createNode = function(config, log){
	const protocolFactory = new ProtocolFactory(uuid, log);
	const client = new Client(config, net, protocolFactory, log);

	return new Node(client, log);
};

exports.createRunner = function(config, manager, log){
	const protocolFactory = new ProtocolFactory(uuid, log);
	const server = new Server(config, net, protocolFactory, log);

	return new ServerRunner(manager, server, log);
};
