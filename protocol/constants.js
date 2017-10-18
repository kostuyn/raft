'use strict';

const REQUEST = 1;
const RESPONSE = 2;

const ID_OFFSET = 14;
const DATA_OFFSET = ID_OFFSET + 4;

exports.types = {
	REQUEST,
	RESPONSE
};

exports.offsets = {
	ID_OFFSET,
	DATA_OFFSET
};
