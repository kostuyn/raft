'use strict';

const assert = require('chai').assert;

const DataHandler = require('../../../rpc/protocol/data_handler');
const bufferFactory = require('../../../rpc/protocol/buffer_factory');

const {REQUEST, RESPONSE} = require('../../../rpc/protocol/constants').types;

describe('DataHandler Test', () => {	
	it('onData request', (done) => {
		const name = 'my name';
		const message = {msg: 'my message1', msg2: 'my message2'};
		
		const handler = new DataHandler();
		const data = bufferFactory(REQUEST, name, message, 123);

		handler.once('request', (msg) => {
			assert.deepEqual(msg, {id: 123, name, message});
			done();
		});

		handler.onData(data);
	});

	it('onData response', (done) => {
		const name = 'my name';
		const message = {msg: 'my message1', msg2: 'my message2'};

		const requestId = 456;
		const protocol = new DataHandler();		
		const data = bufferFactory(RESPONSE, name, message, requestId);

		protocol.once(requestId, (msg) => {
			assert.deepEqual(msg, {id: requestId, name, message});
			done();
		});

		protocol.onData(data);
	});
});
