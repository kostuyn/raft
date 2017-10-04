'use strict';

const EventEmitter = require('events').EventEmitter;

const ID_OFFSET = 11;
const DATA_OFFSET = ID_OFFSET + 16; // 11 = lengthContent + offset + type fields; 16 = uuid length

class Protocol extends EventEmitter {
	constructor(uuid) {
		super();

		this._contentLength = 0;
		this._buffer = new Buffer(0);
		this._uuid = uuid;
	}

	// TODO: id size??
	getData(type, name, msg, id) {
		id = id || this._uuid(null, Array(16), 0);
		
		const messageData = JSON.stringify(msg);
		const dataBuf = Buffer.from(messageData);
		const nameBuf = Buffer.from(name);
		const uuidBuf = Buffer.from(id);

		const offset = nameBuf.length + DATA_OFFSET;
		const length = offset + dataBuf.length;

		let buffer = new Buffer(11);

		buffer.writeUIntBE(dataBuf.length, 0, 8);
		buffer.writeUIntBE(offset, 8, 2);
		buffer.writeUIntBE(type, 10, 1);

		return {
			id: uuidBuf.toString(),
			buffer: Buffer.concat([buffer, uuidBuf, nameBuf, dataBuf], length)
		};
	};

	onData(data) {
		try{
			this._handleData(data);
		} catch(err) {
			this.emit('error', err);
		}
	}

	_handleData(data) {
		this._buffer = Buffer.concat([this._buffer, data]);
		let type;
		let id;
		let name;

		if(!this._contentLength) {
			if(this._buffer.length >= 10) {
				const length = this._buffer.readUIntBE(0, 8);
				const offset = this._buffer.readUIntBE(8, 2);

				if(this._buffer.length >= offset) {
					type = this._buffer.readUIntBE(10, 1);
					id = this._buffer.toString('utf8', ID_OFFSET, DATA_OFFSET);
					name = this._buffer.toString('utf8', DATA_OFFSET, offset);

					this._contentLength = length;
					this._buffer = this._buffer.slice(offset);
				}
			}
		}

		if(this._contentLength) {
			if(this._buffer.length === this._contentLength) {
				this._handleMessage(this._buffer, id, type, name);
			}
			else if(this._buffer.length > this._contentLength) {
				const data = this._buffer.slice(0, this._contentLength);
				const rest = this._buffer.slice(this._contentLength);
				this._handleMessage(data, id, type, name);
				this._handleData(rest);
			}
		}
	}

	_handleMessage(data, id, type, name) {
		this._contentLength = 0;
		this._buffer = new Buffer(0);
		let message;
		try{
			message = JSON.parse(data);
		} catch(e) {
			this.emit('error', new Error('Could not parse JSON: ' + e.message + '\nRequest data: ' + data));
		}
		
		message = message || {};
		const msg = {id, name, message};
		
		switch (type){
			case Protocol.REQUEST:
				return this.emit(Protocol.REQUEST, msg);
			case Protocol.RESPONSE:
				return this.emit(id, msg);
		}		
	}
}

Protocol.REQUEST = 1;
Protocol.RESPONSE = 2;

module.exports = Protocol;
