'use strict';

const Manager = require('./manager');
const Follower = require('./follower');
const Candidate = require('./candidate');
const Leader = require('./leader');

const State = require('./state');
const Timer = require('./timer');

const state = new State();

// logger stub
const log = console;

const follower = new Follower(state, new Timer(), log);
const candidate = new Candidate(state, new Timer(), log);
const leader = new Leader(state, new Timer(), log);

const manager = new Manager(follower, candidate, leader, log);

manager.run();

// await manager.appendEntries({});
// await manager.requestVote({});
//
// manager.addCmd({cmd: "my cmd"});
