'use strict';

const assert = require('chai').assert;

const DataHandler = require('../../../rpc/protocol/data_handler');
const bufferFactory = require('../../../rpc/protocol/buffer_factory');

const {REQUEST, RESPONSE} = require('../../../rpc/protocol/constants').types;

describe('DataHandler Test', () => {
	const idBuf = [217, 119, 223, 141, 202, 93, 66, 3, 178, 198, 149, 37, 232, 4, 107, 241];
	const uuid = (opt, buffer, offset) => {
		idBuf.forEach((val, i) => {
			buffer[offset + i] = val;
		});
		return buffer;
	};
	
	it('onData request', (done) => {
		const type = DataHandler.REQUEST;
		const name = 'my name';
		const message = {msg: 'my message1', msg2: 'my message2'};

		const handler = new DataHandler();
		const data = bufferFactory(REQUEST, name, message, idBuf);

		handler.once('request', (msg) => {
			assert.deepEqual(msg, {id: idBuf, name, message});
			done();
		});

		handler.onData(data);
	});

	it('onData response', (done) => {
		const type = DataHandler.RESPONSE;
		const name = 'my name';
		const message = {msg: 'my message1', msg2: 'my message2'};

		const protocol = new DataHandler(uuid);
		const data = protocol.getData(type, name, message);

		protocol.once(data.id, (msg) => {
			assert.deepEqual(msg, {id: data.id, name, message});
			done();
		});

		protocol.onData(data.buffer);
	});
});
