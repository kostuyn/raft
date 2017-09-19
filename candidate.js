'use strict';

const Base = require('./base');

class Candidate extends Base {
	setManager(manager){
		super.setManager(manager);

		this._requestVoteResponse = this._requestVoteResponse.bind(this);
	}

	run() {
		super.run();

		this._manager.on('requestVoteResponse', this._requestVoteResponse);

		this._timer.start(() => {
			this._manager.switchToCandidate();
		}, 1000);
	}

	stop(){
		super.stop();

		this._manager.removeListener('requestVoteResponse', this._requestVoteResponse);
	}

	_requestVoteResponse({term, voteGranted}){
		// If RPC request or response contains term T > currentTerm:
		// set currentTerm = T, convert to follower (5.1)
		this._manager.switchToFollower();

		// If votes received from majority of servers: become leader
		this._manager.switchToLeader();


		this._checkCommit();
		this._checkTerm(term);
	}
}

module.exports = Candidate;
