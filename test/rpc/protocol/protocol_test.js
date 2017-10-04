'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;

const Protocol = require('../../../rpc/protocol');

describe('Protocol Test', () => {
	const idBuf = [217, 119, 223, 141, 202, 93, 66, 3, 178, 198, 149, 37, 232, 4, 107, 241];
	const uuid = (opt, buffer, offset) => {
		idBuf.forEach((val, i) => {
			buffer[offset + i] = val;
		});
		return buffer;
	};
	
	it('getData', async() => {
		const type = Protocol.REQUEST;
		const name = 'my name';
		const message = {msg: 'my message'};

		const protocol = new Protocol(uuid);
		const data = protocol.getData(type, name, message);

		const length = data.buffer.readUIntBE(0, 8);
		const offset = data.buffer.readUIntBE(8, 2);

		assert.deepEqual(data.id, Buffer.from(idBuf).toString());

		assert.equal(data.buffer.readUIntBE(10, 1), Protocol.REQUEST);
		assert.equal(data.buffer.toString('utf8', 11 + 16, offset), name);
		assert.deepEqual(data.buffer.slice(11, 11 + 16), Buffer.from(idBuf));
		assert.deepEqual(JSON.parse(data.buffer.slice(offset, offset + length)), message);
	});
	
	it('onData request', (done) => {
		const type = Protocol.REQUEST;
		const name = 'my name';
		const message = {msg: 'my message1', msg2: 'my message2'};

		const protocol = new Protocol(uuid);
		const data = protocol.getData(type, name, message);
		
		protocol.once(Protocol.REQUEST, (msg) => {
			assert.deepEqual(msg, {id: data.id, name, message});
			done();
		});

		protocol.onData(data.buffer);
	});

	it('onData response', (done) => {
		const type = Protocol.RESPONSE;
		const name = 'my name';
		const message = {msg: 'my message1', msg2: 'my message2'};

		const protocol = new Protocol(uuid);
		const data = protocol.getData(type, name, message);

		protocol.once(data.id, (msg) => {
			assert.deepEqual(msg, {id: data.id, name, message});
			done();
		});

		protocol.onData(data.buffer);
	});
});
