'use strict';

const {EventEmitter} = require('events');

const {REQUEST, RESPONSE} = require('./constants').types;
const {ID_OFFSET, DATA_OFFSET} = require('./constants').offsets;

class DataHandler extends EventEmitter {
	constructor(log) {
		super();

		this._log = log;

		this._contentLength = 0;
		this._buffer = Buffer.alloc(0);
	}

	onData(data) {
		try {
			this._handleData(data);
		} catch (err) {
			this.emit('error', err);
		}
	}

	_handleData(data) {
		this._buffer = Buffer.concat([this._buffer, data]);
		let type;
		let id;
		let name;

		if (!this._contentLength) {
			if (this._buffer.length >= 10) {
				const length = this._buffer.readUInt32BE(0);
				const offset = this._buffer.readInt16BE(4);

				if (this._buffer.length >= offset) {
					type = this._buffer.readUInt8(6);
					id = this._buffer.readUInt32BE(ID_OFFSET);
					name = this._buffer.toString('utf8', DATA_OFFSET, offset);

					this._contentLength = length;
					this._buffer = this._buffer.slice(offset);
				}
			}
		}

		if (this._contentLength) {
			if (this._buffer.length === this._contentLength) {
				this._handleMessage(this._buffer, id, type, name);
			}
			else if (this._buffer.length > this._contentLength) {
				const data = this._buffer.slice(0, this._contentLength);
				const rest = this._buffer.slice(this._contentLength);
				this._handleMessage(data, id, type, name);
				this._handleData(rest);
			}
		}
	}

	_handleMessage(data, id, type, name) {
		this._contentLength = 0;
		this._buffer = Buffer.alloc(0);
		let message;
		try {
			message = JSON.parse(data);
		} catch (e) {
			this.emit('error', new Error('Could not parse JSON: ' + e.message + '\nRequest data: ' + data));
		}

		message = message || {};
		const msg = {id, name, message};

		switch (type) {
			case REQUEST:
				return this.emit('request', msg);
			case RESPONSE:
				return this.emit(id, msg);
		}
	}
}

module.exports = DataHandler;
