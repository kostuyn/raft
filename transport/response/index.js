'use strict';

const Response = require('./response');

class ResponseFactory {
	constructor(protocolFactory, log) {
		this._protocolFactory = protocolFactory;
		this._log = log;
	}

	create(name, socket) {
		return new Response(name, socket, this._protocolFactory, this._log);
	}
}

module.exports = ResponseFactory;
