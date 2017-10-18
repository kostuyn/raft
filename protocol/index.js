'use strict';

const {REQUEST, RESPONSE} = require('./constants').types;

const bufferFactory = require('./buffer_factory');
const DataHandler = require('./data_handler');

class ProtocolFactory {
	constructor(log) {
		this._log = log;
	}

	createRequest(name, msg, requestId) {
		return bufferFactory(REQUEST, name, msg, requestId);
	}

	createResponse(name, msg, requestId) {
		return bufferFactory(RESPONSE, name, msg, requestId);
	}

	createHandler() {
		return new DataHandler(this._log);
	}
}

exports.createFactory = function(log){
	return new ProtocolFactory(log);
};
