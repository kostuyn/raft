'use strict';

class ServerRunner {
	constructor(manager, server, log) {
		this._manager = manager;

		this._server = server;
		this._log = log;
	}

	async run() {
		this._server.on('appendEntries', async(msg) => {
			const response = await this._manager.appendEntries(msg.message);
			await this._server.responseAsync('appendEntries', {id: msg.id, response});
		});

		this._server.on('requestVote', async(args) => {
			const result = await this._manager.requestVote(args);
			await this._server.responseAsync('requestVote', result);
		});

		this._manager.run();
		await this._server.listenAsync();
	}
}

module.exports = ServerRunner;
