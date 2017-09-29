'use strict';

const uuid = require('uuid').v4;
const _ = require('lodash');

const ENTRIES_COUNT = 10;

class State {
    constructor(nodes) {
        this._nodes = nodes;
        this._nodesCount = nodes.length;
        this._majority = Math.ceil(this._nodesCount / 2) + 1 - this._nodesCount % 2;

        this._id = uuid();
        this.leaderId = null;
        this._votesCount = 0;
        this._voteGranteds = {};

        this.currentTerm = 0;
        this._votedFor = null;

        this._logEntries = [];
        this._lastLogIndex = 0;
        this._lastLogTerm = 0;

        this._commitIndex = 0;
        this._lastApplied = 0;

        this._nextIndex = nodes.reduce((result, node) => {
            result[node.id] = this._lastLogIndex + 1;
            return result;
        }, {});

        this._matchIndex = nodes.reduce((result, node) => {
            result[node.id] = 0;
            return result;
        }, {});
    }

    setLeader(id) {
        this.leaderId = id;
    }

    changeTerm(term) {
        this.currentTerm = term;

        this._votesCount = 0;
        this._voteGranteds = {};
        this._votedFor = null;
    }

    getNodes() {
        return this._nodes;
    }

    vote(id) {
        this._votedFor = id;
    }

    getVoteParams() {
        return {
            term: this.currentTerm,
            candidateId: this._id,
            lastLogIndex: this._lastLogIndex,
            lastLogTerm: this._lastLogTerm
        }
    }

    hasMajorityVotes(id, voteGranted) {
        if (!this._voteGranteds[id] && voteGranted) {
            this._voteGranteds[id] = true;
            this._votesCount++;
        }

        return this._votedFor >= this._majority;
    }

    canVoteGrant(candidateId, lastLogIndex, lastLogTerm) {
        return (!this._votedFor || candidateId === this._votedFor) &&
            (lastLogTerm > this.currentTerm ||
                lastLogTerm === this.currentTerm && lastLogIndex >= this._lastLogIndex);
    }

    getEntriesParams(id) {
        const index = this._nextIndex[id];
        const prevLogIndex = index - 1;
        const prevLogTerm = this._logEntries[prevLogIndex].term;
        const entries = this._logEntries.slice(index, index + ENTRIES_COUNT + 1);

        return {
            term: this.currentTerm,
            leaderId: this._id,
            leaderCommit: this._commitIndex,
            prevLogIndex,
            prevLogTerm,
            entries
        };
    }

    updateIndex(id) {
        this._nextIndex[id] += ENTRIES_COUNT;
        this._matchIndex[id] += ENTRIES_COUNT;
    }

    decrementIndex(id){
        this._nextIndex[id] -= 1;
    }

    hasEntries(id){
        return this._lastLogIndex >= this._nextIndex[id];
    }
}

module.exports = State;
