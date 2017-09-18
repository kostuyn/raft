'use strict';

const Base = require('./base');

class Leader extends Base {
    run() {
        this._timer.start(() => {
            this._manager.emit('appendEntries', {});
        }, 100);

        this._manager.on('appendEntriesResponse', ({term, success}) => {
            // If RPC request or response contains term T > currentTerm:
            // set currentTerm = T, convert to follower (§5.1)
            this._manager.switchToFollower();

            //If there exists an N such that N > commitIndex, a majority
            //of matchIndex[i] ? N, and log[N].term == currentTerm:
            //set commitIndex = N (§5.3, §5.4)
            // TODO: release addCmd promise for concrete log index
        })
    }

    appendEntries(term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit) {
        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T, convert to follower (§5.1)
        this._manager.switchToFollower();
    }

    requestVote(term, candidateId, lastLogIndex, lastLogTerm) {
        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T, convert to follower (§5.1)
        this._manager.switchToFollower();
    }

    addCmd(cmd){
        // TODO: waite majority response and resolve
        return new Promise((resolve) => {

        });
    }
}

module.exports = Leader;
