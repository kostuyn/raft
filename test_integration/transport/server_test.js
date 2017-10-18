'use strict';

const net = require('net');

const sinon = require('sinon');
const {assert} = require('chai');

const transport = require('../../transport');
const protocol = require('../../protocol');

describe('Server Integration Test', () => {
	it('success send request & response', async () => {
		const config = {
			host: 'localhost',
			port: 65001
		};

		const message1 = {foo: {bar: 123}, bar: 'hello'};
		const message2 = {foo2: {bar2: 123}, bar2: 'hello'};

		const reply = {fuz: {baz: 'hello'}, baz: 1234};

		const log = console;
		const protocolFactory = protocol.createFactory(log);
		const transportFactory = transport.createFactory(protocolFactory, net, log);

		const server = transportFactory.createServer(config, protocolFactory, log);

		const listener = await server.listenAsync();
		listener.on('appendEntries', async ({requestId, msg, res}) => {
			await res.sendAsync(requestId, {reply, msg});
		});

		const client1 = transportFactory.createClient(config, protocolFactory, log);
		const client2 = transportFactory.createClient(config, protocolFactory, log);

		await client1.connectAsync();
		await client2.connectAsync();

		const result1 = await client1.sendAsync('appendEntries', message1);
		const result2 = await client2.sendAsync('appendEntries', message2);

		assert.deepEqual(result1, {reply, msg: message1});
		assert.deepEqual(result2, {reply, msg: message2});
	});
});
