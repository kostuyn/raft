'use strict';

const {REQUEST, RESPONSE} = require('./constants').types;

const bufferFactory = require('./buffer_factory');
const DataHandler = require('./data_handler');

class ProtocolFactory {
	constructor(uuid, log) {
		this._uuid = uuid;
		this._log = log;
	}

	createRequest(name, msg) {
		const id = this._uuid(null, Array(16), 0);

		return bufferFactory(REQUEST, name, msg, id);
	}

	createResponse(name, msg, requestId) {
		return bufferFactory(RESPONSE, name, msg, requestId);
	}

	createHandler() {
		return new DataHandler(this._uuid, this._log);
	}
}

module.exports = function (uuid, log) {
	return new ProtocolFactory(uuid, log);
};
