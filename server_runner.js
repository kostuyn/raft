'use strict';

class ServerRunner {
    constructor(manager, server, log) {
        this._manager = manager;
        this._appendEntriesHandler = manager.appendEntries.bind(manager);
        this._requestVoteHandler = manager.requestVote.bind(manager);

        this._server = server;
        this._log = log;
    }

    async run() {
        this._server.on('appendEntries', this._appendEntriesHandler);
        this._server.on('requestVote', this._requestVoteHandler);

        this._manager.run();
        await this._server.listen();
    }
}

module.exports = ServerRunner;
