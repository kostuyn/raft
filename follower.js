'use strict';

const Base = require('./base');

class Follower extends Base {
    run() {
        this._timer.start(() => {
            this._manager.switchToCandidate();
        }, 1000);
    }

    stop() {
        this._timer.stop();
    }

    async appendEntries(args) {
        this._timer.reset();

        // if term >= currentTerm, set leaderId
        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T
        if (args.term >= this._state.currentTerm) {
            this._state.setLeader(args.leaderId);
            this._state.changeTerm(args.term);
        }

        return await super.appendEntries(args)
    }

    async requestVote(args) {
        this._timer.reset();

        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T
        if (args.term > this._state.currentTerm) {
            this._state.changeTerm(args.term);
        }

        return await super.requestVote(args);
    }
}

module.exports = Follower;
