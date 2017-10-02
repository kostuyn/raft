'use strict';

const shortid = require('shortid');
const EventEmitter = require('events').EventEmitter;

class Protocol extends EventEmitter {
    constructor(socket) {
        super();

        this._contentLength = 0;
        this._buffer = new Buffer(0);
        this._socket = socket;

        socket.on('data', (data) => {
            this._onData(data);
        });
        socket.on('error', (err) => {
            this.emit('error', err);
        });
    }

    // TODO: return id for catch its response
    sendAsync(type, name, msg) {
        return new Promise((resolve) => {
            const messageData = JSON.stringify(msg);
            const dataBuf = new Buffer(messageData);
            const nameBuf = new Buffer(name);

            const offset = nameBuf.length + 11;
            const length = offset + dataBuf.length;

            let buffer = new Buffer(11);

            buffer.writeUIntBE(length, 0, 8);
            buffer.writeUIntBE(offset, 8, 2);
            buffer.writeUIntBE(type, 10, 1);
            buffer = Buffer.concat([buffer, nameBuf, dataBuf], length);

            this._socket.write(buffer, () => {
                resolve();
            });
        });
    };

    _onData(data) {
        try {
            this._handleData(data);
        } catch (err) {
            this.emit('error', err);
        }
    }

    _handleData(data) {
        this._buffer = Buffer.concat([this._buffer, data]);
        let type;
        let name;

        if (!this._contentLength) {
            if (this._buffer.length >= 10) {
                const length = this._buffer.readUIntBE(0, 8);
                const offset = this._buffer.readUIntBE(8, 2);

                if (this._buffer.length >= offset) {
                    type = this._buffer.readUIntBE(10, 1);
                    name = this._buffer.toString('utf8', 11, offset);

                    this._contentLength = length - offset;
                    this._buffer = this._buffer.slice(offset);
                }
            }
        }

        if (this._contentLength) {
            if (this._buffer.length === this._contentLength) {
                this._handleMessage(this._buffer, type, name);
            } else if (this._buffer.length > this._contentLength) {
                const message = this._buffer.slice(0, this._contentLength);
                const rest = this._buffer.slice(this._contentLength);
                this._handleMessage(message, type, name);
                this._handleData(rest);
            }
        }
    }

    _handleMessage(data, type, name) {
        this._contentLength = 0;
        this._buffer = new Buffer(0);
        let message;
        try {
            message = JSON.parse(data);
        } catch (e) {
            this.emit('error', new Error('Could not parse JSON: ' + e.message + '\nRequest data: ' + data));
        }
        message = message || {};

        // TODO: split several responses by id ??
        switch (type) {
            case Protocol.REQUEST:
                // TODO: add id for send response with it
                this.emit(Protocol.REQUEST, {name, message});
                break;
            case Protocol.RESPONSE:
                // TODO: add id for find response receiver
                this.emit(Protocol.RESPONSE, {name, message});
                break;
        }
    }

}

Protocol.REQUEST = 1;
Protocol.RESPONSE = 2;

module.exports = Protocol;
