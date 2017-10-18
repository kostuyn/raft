'use strict';

const {EventEmitter} = require('events');

const sinon = require('sinon');
const {assert} = require('chai');

const Server = require('../../transport/server');
const ProtocolFactory = require('../../protocol');

describe('Server Test', () => {
	let netServer;

	const net = {
		createServer: sinon.stub()
	};

	const listenerFactory = {
		create: sinon.stub()
	};

	before(() => {
		netServer =
			Object.assign(new EventEmitter(), {
				listen: sinon.stub(),
			});

		net.createServer.returns(netServer);
	});

	after(() => {
		net.createServer.reset();
		netServer.listen.reset();
	});

	it('listenAsync resolve promise', async () => {
		const listener = {};
		const config = {};
		const server = new Server(config, listenerFactory, net, console);

		listenerFactory.create.returns(listener);
		netServer.listen.callsArgAsync(1);

		const result = await server.listenAsync();

		assert.equal(result, listener);
		sinon.assert.calledWith(netServer.listen, sinon.match.same(config));
	});

	it('listenAsync connect', async () => {
		const socket1 = {};
		const socket2 = {};
		const listener = {
			add: sinon.stub()
		};
		const server = new Server({}, listenerFactory, net, console);

		listenerFactory.create.returns(listener);

		const netServer =
			Object.assign(new EventEmitter(), {
				listen: sinon.stub(),
			});

		netServer.listen.callsArgAsync(1);

		net.createServer.returns(netServer);
		const result = await server.listenAsync().then((result) => {
			netServer.emit('connection', socket1);
			netServer.emit('connection', socket2);
			return result;
		});

		sinon.assert.callCount(result.add, 2);
		sinon.assert.calledWithExactly(result.add, sinon.match.same(socket1));
		sinon.assert.calledWithExactly(result.add, sinon.match.same(socket2));
	});
});
