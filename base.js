'use strict';

class Base {
    constructor(state, entriesLog, timer, log) {
        this._state = state;
        this._entriesLog = entriesLog;
        this._timer = timer;
        this._log = log;
    }

    setManager(manager) {
        this._manager = manager;
	    
	    this._requestVote = this._requestVote.bind(this);



    }

	run() {
		this._manager.on('requestVote', this._requestVote);
	}
	
    stop() {
	    this._manager.removeListener('requestVote', this._requestVote);
        this._timer.stop();
    }

    /**
     * By default returns leaderId
     * @returns {Promise}
     */
    addCmd(){
        return new Promise((resolve) => {
            resolve(this._state.leaderId);
        })
    }

	_checkTerm(term){
		// If RPC request or response contains term T > currentTerm:
		// set currentTerm = T, convert to follower (5.1)

		this._manager.switchToFollower();
	}

	_checkCommit(){
		// If commitIndex > lastApplied: increment lastApplied, apply
		// log[lastApplied] to state machine (5.3)
	}

    _requestVote(term, candidateId, lastLogIndex, lastLogTerm){
        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T, convert to follower (5.1)

	    // Reply false if term < currentTerm (5.1)
	    // If votedFor is null or candidateId, and candidate’s log is at
	    // least as up-to-date as receiver’s log, grant vote (5.2, 5.4)

	    this._manager.switchToFollower();
    }	
}

module.exports = Base;
