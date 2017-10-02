'use strict';

class ServerRunner {
    constructor(manager, server, log) {
        this._manager = manager;

        this._server = server;
        this._log = log;
    }

    async run() {
        this._server.on('appendEntries', async (args) => {
            const result = await this._manager.appendEntries(args);
            await this._server.send('appendEntriesResponse', result);
        });

        this._server.on('requestVote', async (args) => {
            const result = await this._manager.requestVote(args);
            await this._server.send('requestVoteResponse', result);
        });

        this._manager.run();
        await this._server.listen();
    }
}

module.exports = ServerRunner;
