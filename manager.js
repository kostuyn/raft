'use strict';

class Manager{
    constructor(follower, candidate, leader, log){
        this._follower = follower;
        this._candidate = candidate;
        this._leader = leader;
        this._log = log;

        this._current = follower;
    }

    run(){
        this._current.run(this);
    }

    appendEntries({term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit}){
        this._current.appendEntries(term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit);
    }

    requestVote({term, candidateId, lastLogIndex, lastLogTerm}){
        this._current.requestVote(term, candidateId, lastLogIndex, lastLogTerm);
    }

    addCmd(cmd){

    }

    switchToFollower(current){
        this._current.stop();
        this._current = this._follower;
        this._current.run(this);
    }

    switchToCandidate(){
        this._current.stop();
        this._current = this._candidate;
        this._current.run(this);
    }

    switchToLeader(){
        this._current.stop();
        this._current = this._leader;
        this._current.run(this);
    }
}

module.exports = Manager;
