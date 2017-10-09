'use strict';

const {EventEmitter} = require('events');

class Request extends EventEmitter {
	constructor(socket, protocolFactory, log) {
		this._socket = socket;
		this._protocolFactory = protocolFactory;
		this._log = log;	
	}

	
}

module.exports = Request;
