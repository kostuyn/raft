'use strict';

const uuid = require('uuid').v4;
const _ = require('lodash');

const ENTRIES_COUNT = 10;

class State {
	constructor(nodes, cmdHandler) {
		this._nodes = nodes;
		this._cmdHandler = cmdHandler;

		const allNodesCount = nodes.length + 1;
		this._majority = Math.ceil(allNodesCount / 2) - allNodesCount % 2 + 1;

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

	voteForSelf() {
		this._votedFor = this._id;
		this._voteGranteds[this._id] = true;
		this._votesCount++;
	}

	getVoteParams() {
		return {
			term: this.currentTerm,
			candidateId: this._id,
			lastLogIndex: this._lastLogIndex,
			lastLogTerm: this._lastLogTerm
		};
	}

	hasMajorityVotes(id, voteGranted) {
		if(!this._voteGranteds[id] && voteGranted) {
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

	checkConflicts(prevLogIndex, entries) {
		let startEntriesIndex = 0;
		let lastLogIndex = prevLogIndex;

		while(startEntriesIndex < entries.length) {
			const entry = this._logEntries[lastLogIndex];
			const newEntry = entries[startEntriesIndex];
			if(entry.term !== newEntry.term) {
				break;
			}

			startEntriesIndex++;
			lastLogIndex++;
		}

		return {lastLogIndex, startEntriesIndex};
	}

	appendEntries({lastLogIndex, startEntriesIndex}, entries) {
		const logEntries = _.slice(this._logEntries, 0, lastLogIndex + 1);
		const newEntries = _.slice(entries, startEntriesIndex, entries.length);

		this._logEntries = _.concat(logEntries, newEntries);
		this._lastLogIndex = this._logEntries.length - 1;
		this._lastLogTerm = this._logEntries[this._lastLogIndex].term;
	}

	updateCommitIndex(leaderCommit) {
		this._commitIndex = Math.min(leaderCommit, this._lastLogIndex);
	}

	getEntriesParams(id) {
		const index = this._nextIndex[id];
		const prevLogIndex = index - 1;
		const prevLogTerm = this._logEntries[prevLogIndex].term;
		const entries = _.slice(this._logEntries, index, index + ENTRIES_COUNT + 1);

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

	decrementIndex(id) {
		this._nextIndex[id] -= 1;
	}

	hasEntries(id) {
		return this._lastLogIndex >= this._nextIndex[id];
	}

	setMajorityIndex() {
		for(let n = this._commitIndex + 1; n <= this._lastLogIndex; n++) {
			const isMajority = _.filter(this._matchIndex, (val)=> val >= n).length >= this._majority;
			if(!isMajority) {
				break;
			}

			if(this._logEntries[n].term === this.currentTerm) {
				this._commitIndex = n;
			}
		}
	}

	async applyCmd() {
		const results = [];
		while(this._lastApplied < this._commitIndex) {
			const {cmd} = this._logEntries[this._lastApplied + 1];
			// TODO: send cmd to external service. Ex.: await this._cmdService.execute(cmd)
			const result = await this._cmdHandler.execute(cmd);

			results.push({result, cmd});
			this._lastApplied++;
		}

		return results;
	}
}

module.exports = State;
