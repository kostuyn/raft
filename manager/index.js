'use strict';

const Manager = require('./manager');
const Follower = require('./roles/follower');
const Candidate = require('./roles/candidate');
const Leader = require('./roles/leader');

module.exports = function(state, timerFactory, log){
    const follower = new Follower(state, timerFactory(), log);
    const candidate = new Candidate(state, timerFactory(), log);
    const leader = new Leader(state, timerFactory(), log);

    return new Manager(follower, candidate, leader, log);
};
