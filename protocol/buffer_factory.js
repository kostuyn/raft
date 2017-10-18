'use strict';

const {ID_OFFSET, DATA_OFFSET} = require('./constants').offsets;

module.exports = function (type, name, msg, id) {
	const messageData = JSON.stringify(msg);
	const dataBuf = Buffer.from(messageData);
	const nameBuf = Buffer.from(name);

	const offset = nameBuf.length + DATA_OFFSET;
	const length = offset + dataBuf.length;

	let buffer = new Buffer(DATA_OFFSET);

	buffer.writeUInt32BE(dataBuf.length, 0);
	buffer.writeInt16BE(offset, 4);
	buffer.writeUInt8(type, 6);
	buffer.writeUInt32BE(id, ID_OFFSET);

	return Buffer.concat([buffer, nameBuf, dataBuf], length);
};
