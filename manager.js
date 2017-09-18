'use strict';

const EventEmitter = require('events').EventEmitter;

class Manager extends EventEmitter {
    constructor(follower, candidate, leader, log) {
        this._follower = follower;
        this._candidate = candidate;
        this._leader = leader;
        this._log = log;

        this._current = follower;

        this._follower.setManager(this);
        this._candidate.setManager(this);
        this._leader.setManager(this);
    }

    run() {
        this._current.run(this);
    }

    appendEntries({term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit}) {
        this._current.appendEntries(term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit);
    }

    requestVote({term, candidateId, lastLogIndex, lastLogTerm}) {
        this._current.requestVote(term, candidateId, lastLogIndex, lastLogTerm);
    }

    addCmd(cmd) {

    }

    switchToFollower(current) {
        this._current.stop();
        this._current = this._follower;
        this._current.run(this);
    }

    switchToCandidate() {
        this._current.stop();
        this._current = this._candidate;
        this._current.run(this);
    }

    switchToLeader() {
        this._current.stop();
        this._current = this._leader;
        this._current.run(this);
    }
}

module.exports = Manager;
