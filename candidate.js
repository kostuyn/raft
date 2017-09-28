'use strict';

const Base = require('./base');

class Candidate extends Base {
    run() {
        // Increment currentTerm
        // Vote for self
        const voteParams = this._state.getVoteParams();

        this._state.getNodes().forEach((node) => {
            this._requestVoteHandler(voteParams, node);
        });

        this._timer.start(() => {
            this._manager.switchToCandidate();
        }, 1000);
    }

    stop() {
        this._timer.stop();
        this._state.getNodes().forEach((node) => {
            node.erase();
        });
    }

    async appendEntries(args) {
        // If AppendEntries RPC received from new leader: convert to
        // follower
        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T, convert to follower (5.1)
        if (args.term >= this._state.currentTerm) {
            this._state.changeTerm(args.term);
            this._manager.switchToFollower();
            return await this._manager.appendEntries(args)
        }

        return await super.appendEntries(args);
    }

    async requestVote(args) {
        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T, convert to follower (5.1)
        if (args.term > this._state.currentTerm) {
            this._state.changeTerm(args.term);
            this._manager.switchToFollower();
            return await this._manager.requestVote(args);
        }

        return await super.requestVote(args);
    }

    async _requestVoteHandler(voteParams, node) {
        const vote = await node.requestVote(voteParams);

        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T, convert to follower (5.1)
        if (vote.term > this._state.currentTerm) {
            this._state.changeTerm(vote.term);
            return this._manager.switchToFollower();
        }

        // If votes received from majority of servers: become leader
        const isMajority = this._state.voteGranted(node.id, vote);
        if (isMajority) {
            this._manager.switchToLeader();
        }
    }
}

module.exports = Candidate;
