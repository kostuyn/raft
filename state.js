'use strict';

const uuid = require('uuid').v4;

class State{
    constructor(nodes){
        this._nodes = nodes;
        this._id = uuid();
        this.leaderId = null;

        this.currentTerm = 0;
        this._votedFor = null;

        this._logEntriest = [];
        this._lastLogIndex = 0;
        this._lastLogTerm = 0;

        this._commitIndex = 0;
        this._lastApplied = 0;

        this._nextIndex = 0;
        this._matchIndex = 0;
    }

    setLeader(id){
        this.leaderId = id;
    }

    changeTerm(term){
        this.currentTerm = term;
    }

    getNodes(){
        return nodes;
    }

    getVoteParams(){
        return {
            term: this.currentTerm,
            candidateId: this._id,
            lastLogIndex: this._lastLogIndex,
            lastLogTerm: this._lastLogTerm
        }
    }

    voteGranted(id, {term, voteGranted}){
        
    }
}

module.exports = State;
