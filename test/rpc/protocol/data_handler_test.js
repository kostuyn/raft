'use strict';

const {assert} = require('chai');

const DataHandler = require('../../../rpc/protocol/data_handler');
const bufferFactory = require('../../../rpc/protocol/buffer_factory');

const {REQUEST, RESPONSE} = require('../../../rpc/protocol/constants').types;

describe('DataHandler Test', () => {	
	it('onData request', (done) => {
		const requestId = 123;
		const name = 'my name';
		const msg = {msg: 'my message1', msg2: 'my message2'};
		
		const handler = new DataHandler();
		const data = bufferFactory(REQUEST, name, msg, requestId);

		handler.once('request', (message) => {
			assert.deepEqual(message, {requestId, name, msg});
			done();
		});

		handler.onData(data);
	});

	it('onData response', (done) => {
		const requestId = 456;
		const name = 'my name';
		const msg = {msg: 'my message1', msg2: 'my message2'};

		const protocol = new DataHandler();		
		const data = bufferFactory(RESPONSE, name, msg, requestId);

		protocol.once(requestId, (message) => {
			assert.deepEqual(message, {requestId, name, msg});
			done();
		});

		protocol.onData(data);
	});
});
