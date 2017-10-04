'use strict';

const uuid = require('uuid/v4');
const net = require('net');

const Client = require('./transport/client');
const Server = require('./transport/server');
const Protocol = require('./transport/protocol');

const Node = require('./node');
const ServerRunner  = require('./server_runner');

exports.createNode = function(config, log){
	const protocol = new Protocol(uuid);
	const client = new Client(config, net, protocol, log);

	return new Node(client, log);
};

exports.createRunner = function(config, manager, log){
	const protocol = new Protocol(uuid);
	const server = new Server(config, net, protocol, log);

	return new ServerRunner(manager, server, log);
};
