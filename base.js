'use strict';

class Base {
    constructor(state, timer, log) {
        this._state = state;
        this._timer = timer;
        this._log = log;
    }

    setManager(manager) {
        this._manager = manager;
    }

    /**
     * By default returns leaderId
     * @returns {Promise}
     */
    addCmd(cmd) {
        return new Promise((resolve) => {
            resolve({leaderId: this._state.leaderId});
        });
    }

	/**
     * @param term - leader’s term
     * @param leaderId - so follower can redirect clients
     * @param prevLogIndex - index of log entry immediately preceding new ones
     * @param prevLogTerm - term of prevLogIndex entry
     * @param entries - log entries to store (empty for heartbeat; may send more than one for efficiency)
     * @param leaderCommit - leader’s commitIndex
     * @returns {{success: boolean, term: number}}
	 */
    async appendEntries({term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit}) {
        // 1. Reply false if term < currentTerm (5.1)
        // 2. Reply false if log doesn't contain an entry at prevLogIndex
        // whose term matches prevLogTerm (5.3)
        if (term < this._state.currentTerm ||
            !this._state.contains(prevLogIndex, prevLogTerm)) {
            return {success: false, term: this._state.currentTerm};
        }

        // 3. If an existing entry conflicts with a new one (same index
        // but different terms), delete the existing entry and all that
        // follow it (5.3)
        const indexParams = this._state.checkConflicts(prevLogIndex, prevLogTerm, entries);

        // 4. Append any new entries not already in the log
        this._state.appendEntries(indexParams, entries);

        // 5. If leaderCommit > commitIndex, set
        // commitIndex = min(leaderCommit, index of last new entry)
        this._state.updateCommitIndex(leaderCommit);

        // If commitIndex > lastApplied: increment lastApplied, apply
        // log[lastApplied] to state machine (5.3)
        await this._state.applyCmd();

        return {success: true, term: this._state.currentTerm};
    }

    async requestVote({term, candidateId, lastLogIndex, lastLogTerm}) {
        // Reply false if term < currentTerm (5.1)
        if (term < this._state.currentTerm) {
            return {voteGranted: false, term: this._state.currentTerm};
        }

        // If votedFor is null or candidateId, and candidate’s log is at
        // least as up-to-date as receiver’s log, grant vote (5.2, 5.4)
        const voteGranted = term < this._state.currentTerm &&
            this._state.canVoteGrant(candidateId, lastLogIndex, lastLogTerm);
        
        return {term: this._state.currentTerm, voteGranted};
    }
}

module.exports = Base;
