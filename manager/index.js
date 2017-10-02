'use strict';

const Manager = require('./manager');
const Follower = require('./roles/follower');
const Candidate = require('./roles/candidate');
const Leader = require('./roles/leader');
const State = require('./state');

exports.create = function(timerFactory, nodes, cmdHandler, log){
	const state = new State(nodes.length);
    const follower = new Follower(state, timerFactory(), nodes, cmdHandler, log);
    const candidate = new Candidate(state, timerFactory(), nodes, cmdHandler, log);
    const leader = new Leader(state, timerFactory(), nodes, cmdHandler, log);

    return new Manager(follower, candidate, leader, log);
};
