'use strict';

const Manager = require('./manager');
const Follower = require('./follower');
const Candidate = require('./candidate');
const Leader = require('./leader');

const CommandHandler = require('./command_handles');
const Node = require('./node');

const State = require('./state');
const Timer = require('./timer');

// logger stub
const log = console;

const node1 = new Node(log);
const node2 = new Node(log);
const cmdHandler = new CommandHandler(log);

const state = new State([node1, node2], cmdHandler);

const follower = new Follower(state, new Timer(), log);
const candidate = new Candidate(state, new Timer(), log);
const leader = new Leader(state, new Timer(), log);

const manager = new Manager(follower, candidate, leader, log);

manager.run();

// await manager.appendEntries({});
// await manager.requestVote({});
//
// manager.addCmd({cmd: "my cmd"});
