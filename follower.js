'use strict';

const Base = require('./base');

class Follower extends Base {
    run() {
        this._timer.start(() => {
            manager.switchToCandidate();
        }, 1000);
    }

    appendEntries(term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit) {

    }

    requestVote(term, candidateId, lastLogIndex, lastLogTerm) {

    }
}

module.exports = Follower;
