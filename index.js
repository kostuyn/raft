'use strict';

const managerFactory = require('./manager');

const Client = require('./transport/client');
const ServerRunner = require('./server_runner');
const Server = require('./transport/server');

const CommandHandler = require('./command_handler');
const Node = require('./node');

const State = require('./state');
const timerFactory = require('./lib/timer');

// logger stub
const log = console;

const client1 = new Client(log);
const client2 = new Client(log);

const node1 = new Node(client1, log);
const node2 = new Node(client2, log);

const cmdHandler = new CommandHandler(log);

const state = new State([node1, node2], cmdHandler);

const manager = managerFactory(state, timerFactory, log);

const server = new Server(log);
const serverRunner = new ServerRunner(manager, server, log);

(async function(){
    await serverRunner.run();
})();


// manager.addCmd({cmd: "my cmd"});
