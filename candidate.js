'use strict';

const Base = require('./base');

class Candidate extends Base {
    run(){
        this._timer.start(()=>{
            this._manager.switchToCandidate();
        }, 1000);

        // Vote for self

        this._manager.emit('requestVote', {});
        this._manager.on('requestVoteResponse', ({term, voteGranted}) => {
            // If RPC request or response contains term T > currentTerm:
            // set currentTerm = T, convert to follower (§5.1)
            this._manager.switchToFollower();

            // If votes received from majority of servers: become leader
            this._manager.switchToLeader();
        });
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
}

module.exports = Candidate;
