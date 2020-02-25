let codec = require('./codec.js');

module.exports = {
	encode:codec.encode,
	decode:codec.decode,
	decodeBinary:codec.decodeBinary,
	encodeBinary:codec.encodeBinary,
	unpackString:codec.unpackString,
	packString:codec.packString,
}