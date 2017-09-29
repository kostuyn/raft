'use strict';

const Base = require('./base');

class Leader extends Base {
    run() {
        this._state.nodes.forEach((node) => {
            this._appendEntriesHandler(node);
        });
    }

    stop() {
        this._state.nodes.forEach((node) => {
            node.erase();
        });
    }

    async appendEntries(args) {
        // If RPC request or response contains term T > currentTerm:
        // set currentTerm = T, convert to follower (5.1)
        if (args.term > this._state.currentTerm) {
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

    addCmd(cmd) {
        // If command received from client: append entry to local log,
        //     respond after entry applied to state machine (5.3)
        // TODO: waite majority response and resolve
        return new Promise((resolve) => {

        });

        //return this._state.addCmd(cmd);
    }

    async _appendEntriesHandler(node) {
        // If last log index ≥ nextIndex for a follower: send
        // AppendEntries RPC with log entries starting at nextIndex
        const entriesParams = this._state.getEntriesParams(node.id);
        const result = await node.appendEntries(entriesParams);

        if (result.term > this._state.currentTerm) {
            this._state.changeTerm(result.term);
            return this._manager.switchToFollower();
        }

        // If successful: update nextIndex and matchIndex for
        //     follower (5.3)
        if (result.success) {
            this._state.updateIndex(node.id);

            //If there exists an N such that N > commitIndex, a majority
            //of matchIndex[i] >= N, and log[N].term == currentTerm:
            //set commitIndex = N (5.3, 5.4)
            this._state.changeCommitIndex(index);

            // If commitIndex > lastApplied: increment lastApplied, apply
            // log[lastApplied] to state machine (5.3)
            this._state.applyCmd();

            if(this._state.hasEntries(node.id)){
                await this._appendEntriesHandler(node);
            }

            await this._timer.delay(100);
            await this._appendEntriesHandler(node);
        } else {
            // If AppendEntries fails because of log inconsistency:
            //     decrement nextIndex and retry (5.3)
            this._state.decrementIndex(node.id);
            await this._appendEntriesHandler(node);
        }
    }
}

module.exports = Leader;
