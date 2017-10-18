'use strict';

class ServerRunner {
	constructor(manager, server, log) {
		this._manager = manager;
		this._server = server;
		this._log = log;
	}

	async run() {
		this._manager.run();

		const listener = await this._server.listenAsync();

		listener.on('appendEntries', async ({requestId, msg, res}) => {
			const reply = await this._manager.appendEntries(msg);
			await res.sendAsync(requestId, reply);
		});

		listener.on('requestVote', async ({requestId, msg, res}) => {
			const reply = await this._manager.requestVote(msg);
			await res.sendAsync(requestId, reply);
		});
	}
}

module.exports = ServerRunner;
