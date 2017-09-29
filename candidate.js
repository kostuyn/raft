'use strict';


const _ = require('lodash');

const Base = require('./base');

class Candidate extends Base {
    run() {
        // Increment currentTerm
        // Vote for self
        const newTerm = this._state.currentTerm + 1;
        this._state.changeTerm(newTerm);
        this._state.voteForSelf();

        const voteParams = this._state.getVoteParams();

        _.forEach(this._state.getNodes(), (node) => {
            this._requestVoteHandler(voteParams, node);
        });

        this._timer.start(() => {
            this._manager.switchToCandidate();
        }, 1000);
    }

    stop() {
        this._timer.stop();
        _.forEach(this._state.getNodes(), (node) => {
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
        const {term, voteGranted} = await node.requestVote(voteParams);

        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T, convert to follower (5.1)
        if (term > this._state.currentTerm) {
            this._state.changeTerm(term);
            return this._manager.switchToFollower();
        }

        // If votes received from majority of servers: become leader
        const isMajority = this._state.hasMajorityVotes(node.id, voteGranted);
        if (isMajority) {
            this._manager.switchToLeader();
        }
    }
}

module.exports = Candidate;
