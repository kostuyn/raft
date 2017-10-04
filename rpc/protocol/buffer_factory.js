'use strict';

const {DATA_OFFSET} = require('./constants').offsets;

module.exports = function (type, name, msg, id) {
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

	return Buffer.concat([buffer, uuidBuf, nameBuf, dataBuf], length);
};
