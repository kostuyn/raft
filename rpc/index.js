'use strict';

const Client = require('./transport/client');
const Server = require('./transport/server');
const Node = require('./node');
const ServerRunner  = require('./server_runner');

exports.createNode = function(config, log){
	const client = new Client(config, log);
	return new Node(client, log);
};

exports.createRunner = function(config, manager, log){
	const server = new Server(config, log);
	return new ServerRunner(manager, server, log);
};
