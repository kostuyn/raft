'use strict';

const REQUEST = 1;
const RESPONSE = 2;

const ID_OFFSET = 11;
const DATA_OFFSET = ID_OFFSET + 16;

exports.types = {
	REQUEST,
	RESPONSE
};

exports.offsets = {
	ID_OFFSET,
	DATA_OFFSET
};
