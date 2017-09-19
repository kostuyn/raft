'use strict';

const Base = require('./base');

class Follower extends Base {
    setManager(manager){
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

    stop(){
        this._manager.removeListener('appendEntries', this._appendEntries);        

        this._timer.stop();
    }

    _appendEntries({term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit}){
        // Reply false if term < currentTerm (5.1)
        // 2. Reply false if log doesn’t contain an entry at prevLogIndex
        // whose term matches prevLogTerm (5.3)
        // 3. If an existing entry conflicts with a new one (same index
        // but different terms), delete the existing entry and all that
        // follow it (5.3)
        // 4. Append any new entries not already in the log
        // 5. If leaderCommit > commitIndex, set commitIndex =
        //     min(leaderCommit, index of last new entry)
        
        this._checkCommit();
        this._checkTerm(term);
    }
}

module.exports = Follower;
