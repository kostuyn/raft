'use strict';

class Node {
    constructor(clientFactory, log) {
        this._clientFactory = clientFactory;
        this._log = log;
    }

    async connect() {
        this._client = this._clientFactory.create();
        // TODO: reconnect logic
        //this._client.on('error', );

        await this._client.connect();
    }

    async erase() {
        await this._client.disconnect();
    }

    async appendEntries(args) {
        return await this._client.emit('appendEntries', args);
    }

    async requestVote(args) {
        return await this._client.emit('requestVote', args);
    }
}

module.exports = Node;
