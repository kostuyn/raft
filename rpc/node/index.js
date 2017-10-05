'use strict';

class Node {
    constructor(client, log) {
        this._client = client;
        this._log = log;
    }

    async connect() {
        // TODO: reconnect logic
        //this._client.on('error', );Async

        await this._client.connectAsync();
    }

    async close() {
        await this._client.closeAsync();
    }

    async appendEntries(args) {
        return await this._client.sendAsync('appendEntries', args);
    }

    async requestVote(args) {
        return await this._client.sendAsync('requestVote', args);
    }
}

module.exports = Node;
