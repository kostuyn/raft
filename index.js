'use strict';

const Manager = require('./manager');
const Follower = require('./follower');
const Candidate = require('./candidate');
const Leader = require('./leader');

const ClientFactory = require('./client_factory');
const ServerRunner = require('./server_runner');
const Server = require('./server');

const CommandHandler = require('./command_handles');
const Node = require('./node');

const State = require('./state');
const Timer = require('./timer');

// logger stub
const log = console;

const clientFactory = new ClientFactory(log);

const node1 = new Node(clientFactory, log);
const node2 = new Node(clientFactory, log);

const cmdHandler = new CommandHandler(log);

const state = new State([node1, node2], cmdHandler);

const follower = new Follower(state, new Timer(), log);
const candidate = new Candidate(state, new Timer(), log);
const leader = new Leader(state, new Timer(), log);

const manager = new Manager(follower, candidate, leader, log);

const server = new Server(log);
const serverRunner = new ServerRunner(manager, server, log);

(async function(){
    await serverRunner.run();
})();


// manager.addCmd({cmd: "my cmd"});
