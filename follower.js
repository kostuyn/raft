'use strict';

class Follower extends EventEmitter{
    constructor(state, timer, log){
        super();

        this._state = state;
        this._timer = timer;
        this._log = log;
    }

    run(manager){
        this._timer.start(() => {
            manager.switchToCandidate();
        }, 1000);
    }

    appendEntries(term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit){

    }

    requestVote(term, candidateId, lastLogIndex, lastLogTerm){

    }
}

module.exports = Follower;
