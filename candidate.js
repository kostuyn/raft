'use strict';

class Candidate{
    constructor(state, log){
        this._state = state;
        this._log = log;
    }

    appendEntries(term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit){

    }

    requestVote(term, candidateId, lastLogIndex, lastLogTerm){

    }

    run(manager){

    }
}

module.exports = Candidate;
