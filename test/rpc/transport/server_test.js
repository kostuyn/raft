'use strict';

const sinon = require('sinon');
const {assert} = require('chai');

const Server = require('../../../rpc/transport/server');
const ProtocolFactory = require('../../../rpc/protocol');

describe('Server Test', () => {
	const socket = {
		on: sinon.stub()
	};
	
	const netServer = {
		listen: sinon.stub(),
		on: sinon.stub()
	};
	
	const handler = {
		onData: sinon.stub(),
		on: sinon.stub()
	};

	const net = {
		createServer: sinon.stub()
	};

	const protocolFactoryMock = {
		createResponse: sinon.stub(),
		createHandler: () => handler
	};

	before(() =>{
		net.createServer.returns(netServer);
	});
	
	after(() => {		
		handler.on.reset();
		handler.onData.reset();

		socket.on.reset();
		net.createServer.reset();

		netServer.listen.reset();
		netServer.on.reset();
		
		protocolFactoryMock.createResponse.reset();
	});

	it('listenAsync resolve promise', async () => {
		const server = new Server({}, protocolFactoryMock, net, console);

		netServer.listen.callsArgAsync(1);

		await server.listenAsync();
	});

	it('listenAsync emit event', (done) => {
		const id = 123;
		const name = 'my event';
		const data = {hello: 'world'};

		const server = new Server({}, protocolFactoryMock, net, console);

		netServer.on.withArgs('connection').callsArgWithAsync(1, socket);
		handler.on.withArgs('request').callsArgWithAsync(1, {id, name, data});

		server.on(name, (event) => {
			assert.isString(event.clientId);
			assert.equal(event.requestId, id);
			assert.equal(event.data, data);
			
			done();
		});

		server.listenAsync();
	});

	it('listenAsync emit events', (done) => {
		let clientId = -1;
		const id = 123;
		const name = 'my event';
		const data = {hello: 'world'};
	
		const protocolFactory = new ProtocolFactory(console);
		const server = new Server({}, protocolFactory, net, console);
		const socket1 = {
			on: sinon.stub()
		};
		const socket2 = {
			on: sinon.stub()
		};
	
		netServer.on.withArgs('connection').onCall(0).callsArgWithAsync(1, socket1);
		netServer.on.withArgs('connection').onCall(1).callsArgWithAsync(1, socket2);
	
		socket1.on.withArgs('data').callsArgWithAsync(1, protocolFactory.createRequest(name, data, id));
		
		server.on(name, (event) => {
			assert.isString(event.clientId);
			assert.equal(event.requestId, id);
			assert.equal(event.data, data);
	
			clientId = event.clientId;
			console.log(clientId);
	
			if(clientId >= 2) {
				done();
			}
		});
	
		server.listenAsync();
	});
});
