'use strict';

class Node {
    constructor(client, log) {
        this._client = client;
        this._log = log;
    }

    async connect() {
        // TODO: reconnect logic
        //this._client.on('error', );

        await this._client.connect();
    }

    async close() {
        await this._client.close();
    }

    async appendEntries(args) {
        return await this._client.send('appendEntries', args);
    }

    async requestVote(args) {
        return await this._client.send('requestVote', args);
    }
}

module.exports = Node;
