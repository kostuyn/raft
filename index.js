'use strict';

const Manager = require('./manager');
const Follower = require('./follower');
const Candidate = require('./candidate');
const Leader = require('./leader');

const State = require('./state');

const state = new State();

const log = console;

const follower = new Follower(state, log);
const candidate = new Candidate(state, log);
const leader = new Leader(state, log);

const manager = new Manager();

manager.run();

manager.appendEntries({});
manager.requestVote({});

manager.addCmd({cmd: "my cmd"});
