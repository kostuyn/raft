'use strict';

class ServerRunner {
	constructor(manager, server, log) {
		this._manager = manager;

		this._server = server;
		this._log = log;
	}

	async run() {
		this._server.on('appendEntries', async(msg) => {
			const reply = await this._manager.appendEntries(msg.message);
			const response = this._createResponse(reply, msg);

			await this._server.responseAsync('appendEntries', response);
		});

		this._server.on('requestVote', async(args) => {
			const reply = await this._manager.requestVote(args);
			const response = this._createResponse(reply, msg);

			await this._server.responseAsync('requestVote', response);
		});

		this._manager.run();
		await this._server.listenAsync();
	}

	_createResponse(reply, msg) {
		return {
			reply,
			clientId: msg.clientId,
			requestId: msg.requestId
		};
	}
}

module.exports = ServerRunner;
