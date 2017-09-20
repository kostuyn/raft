'use strict';

const Base = require('./base');

class Follower extends Base {
	setManager(manager) {
		super.setManager(manager);

		this._appendEntries = this._appendEntries.bind(this);
	}

	run() {
		super.run();

		this._manager.on('appendEntries', this._appendEntries);

		this._timer.start(() => {
			this._manager.switchToCandidate();
		}, 1000);
	}

	stop() {
		this._manager.removeListener('appendEntries', this._appendEntries);

		this._timer.stop();
	}

	_appendEntries({term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit}) {

		// 5. If leaderCommit > commitIndex, set commitIndex =
		//     min(leaderCommit, index of last new entry)

		// 1. Reply false if term < currentTerm (5.1)
		// 2. Reply false if log doesn’t contain an entry at prevLogIndex
		// whose term matches prevLogTerm (5.3)

		// TODO: already follower ??
		// if(term > this._state.currentTerm){
		// 	process.nextTick(() => {
		// 		this._manager.switchToFollower();
		// 	});
		// }

		const success = term >= this._state.currentTerm &&
			this._state.contains(prevLogIndex, prevLogTerm);

		const term = this._state.currentTerm;


		// 3. If an existing entry conflicts with a new one (same index
		// but different terms), delete the existing entry and all that
		// follow it (5.3)
		// 4. Append any new entries not already in the log
		this._state.addEntires(prevLogIndex, prevLogTerm, entries);

		if(term < this._state.currentTerm) {
			return this._manager.emit('appendEntriesResponse', {
				term: this._state.currentTerm,
				success: false
			});
		}

		if(this._state.checkEntries(prevLogIndex, prevLogTerm)) {
			return this._manager.emit('appendEntriesResponse', {
				term: this._state.currentTerm,
				success: false
			});
		}

		this._checkCommit();
		this._checkTerm(term);
	}
}

module.exports = Follower;
