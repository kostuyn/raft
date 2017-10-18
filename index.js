'use strict';

const net = require('net');

const managerFactory = require('./raft_manager');

const transport = require('./transport');
const protocol = require('./protocol');

const Node = require('./node');
const ServerRunner = require('./server_runner');

const CommandHandler = require('./command_handler');

const timerFactory = require('./lib/timer');

// logger stub
const log = console;

const protocolFactory = protocol.createFactory(log);

const node1 = createNode({}, protocolFactory, log);
const node2 = createNode({}, protocolFactory, log);
const nodes = [node1, node2];

const cmdHandler = new CommandHandler(log);

const manager = managerFactory.create(timerFactory, nodes, cmdHandler, log);

const serverRunner = createRunner({}, protocolFactory, manager, log);

(async function(){
    await serverRunner.run();
})();


// manager.addCmd({cmd: "my cmd"});

function createNode(config, protocolFactory, log) {
	const transportFactory = transport.createFactory(protocolFactory, net, log);
	const client = transportFactory.createClient(config, protocolFactory, log);

	return new Node(client, log);
}

function createRunner(config, protocolFactory, manager, log) {
	const transportFactory = transport.createFactory(protocolFactory, net, log);
	const server = transportFactory.createServer(config, protocolFactory, log);

	return new ServerRunner(manager, server, log);
}
