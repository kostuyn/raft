'use strict';

const assert = require('chai').assert;

const bufferFactory = require('../../protocol/buffer_factory');
const {REQUEST, RESPONSE} = require('../../protocol/constants').types;
const {ID_OFFSET, DATA_OFFSET} = require('../../protocol/constants').offsets;

describe('Protocol Test', () => {
	it('bufferFactory request', async() => {
		const name = 'my name';
		const message = {msg: 'my message'};

		const data = bufferFactory(REQUEST, name, message, 123);

		const length = data.readUInt32BE(0);
		const offset = data.readUInt16BE(4);

		assert.equal(data.readUInt8(6), REQUEST);

		assert.equal(data.readUInt32BE(ID_OFFSET), 123);
		assert.equal(data.toString('utf8', DATA_OFFSET, offset), name);
		assert.deepEqual(JSON.parse(data.slice(offset, length + offset)), message);
	});
});
