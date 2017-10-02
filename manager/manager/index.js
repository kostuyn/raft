'use strict';

class Manager {
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

    async appendEntries(args) {
        return await this._current.appendEntries(args);
    }

    async requestVote(args) {
        return await this._current.requestVote(args);
    }

    async addCmd(cmd) {
        return await this._current.addCmd(cmd);
    }

    switchToFollower() {
        if (this._current == this._follower) {
            return;
        }

        this._current.stop();
        this._current = this._follower;
        this._current.run(this);
    }

    switchToCandidate() {
        if (this._current == this._leader) {
            return;
        }

        this._current.stop();
        this._current = this._candidate;
        this._current.run(this);
    }

    switchToLeader() {
        if (this._current != this._candidate) {
            return;
        }

        this._current.stop();
        this._current = this._leader;
        this._current.run(this);
    }
}

module.exports = Manager;
