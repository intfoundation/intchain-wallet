/*!
 * reader.js - buffer reader for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
'use strict';

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var _assert = require("assert");
var encoding_1 = require("./encoding");
var digest = require("./digest");
var bignumber_js_1 = require("bignumber.js");
var EMPTY = Buffer.alloc(0);
/**
 * An object that allows reading of buffers in a sane manner.
 * @alias module:utils.BufferReader
 * @constructor
 * @param {Buffer} data
 * @param {Boolean?} zeroCopy - Do not reallocate buffers when
 * slicing. Note that this can lead to memory leaks if not used
 * carefully.
 */

var BufferReader = function () {
    function BufferReader(data, zeroCopy) {
        (0, _classCallCheck3.default)(this, BufferReader);

        if (!(this instanceof BufferReader)) {
            return new BufferReader(data, zeroCopy);
        }
        _assert(Buffer.isBuffer(data), 'Must pass a Buffer.');
        this.data = data;
        this.offset = 0;
        this.zeroCopy = zeroCopy || false;
        this.stack = [];
    }
    /**
     * Assertion.
     * @param {Boolean} value
     */


    (0, _createClass3.default)(BufferReader, [{
        key: "assert",
        value: function assert(value) {
            if (!value) {
                throw new encoding_1.EncodingError(this.offset, 'Out of bounds read', _assert);
            }
        }
        /**
         * Assertion.
         * @param {Boolean} value
         * @param {String} reason
         */

    }, {
        key: "enforce",
        value: function enforce(value, reason) {
            if (!value) {
                throw new encoding_1.EncodingError(this.offset, reason);
            }
        }
        /**
         * Get total size of passed-in Buffer.
         * @returns {Buffer}
         */

    }, {
        key: "getSize",
        value: function getSize() {
            return this.data.length;
        }
        /**
         * Calculate number of bytes left to read.
         * @returns {Number}
         */

    }, {
        key: "left",
        value: function left() {
            this.assert(this.offset <= this.data.length);
            return this.data.length - this.offset;
        }
        /**
         * Seek to a position to read from by offset.
         * @param {Number} off - Offset (positive or negative).
         */

    }, {
        key: "seek",
        value: function seek(off) {
            this.assert(this.offset + off >= 0);
            this.assert(this.offset + off <= this.data.length);
            this.offset += off;
            return off;
        }
        /**
         * Mark the current starting position.
         */

    }, {
        key: "start",
        value: function start() {
            this.stack.push(this.offset);
            return this.offset;
        }
        /**
         * Stop reading. Pop the start position off the stack
         * and calculate the size of the data read.
         * @returns {Number} Size.
         * @throws on empty stack.
         */

    }, {
        key: "end",
        value: function end() {
            _assert(this.stack.length > 0);
            var start = this.stack.pop();
            return this.offset - start;
        }
        /**
         * Stop reading. Pop the start position off the stack
         * and return the data read.
         * @param {Bolean?} zeroCopy - Do a fast buffer
         * slice instead of allocating a new buffer (warning:
         * may cause memory leaks if not used with care).
         * @returns {Buffer} Data read.
         * @throws on empty stack.
         */

    }, {
        key: "endData",
        value: function endData(zeroCopy) {
            _assert(this.stack.length > 0);
            var start = this.stack.pop();
            var end = this.offset;
            var size = end - start;
            var data = this.data;
            if (size === data.length) {
                return data;
            }
            if (this.zeroCopy || zeroCopy) {
                return data.slice(start, end);
            }
            var ret = Buffer.allocUnsafe(size);
            data.copy(ret, 0, start, end);
            return ret;
        }
        /**
         * Destroy the reader. Remove references to the data.
         */

    }, {
        key: "destroy",
        value: function destroy() {
            this.data = EMPTY;
            this.offset = 0;
            this.stack.length = 0;
        }
        /**
         * Read uint8.
         * @returns {Number}
         */

    }, {
        key: "readU8",
        value: function readU8() {
            this.assert(this.offset + 1 <= this.data.length);
            var ret = this.data[this.offset];
            this.offset += 1;
            return ret;
        }
        /**
         * Read uint16le.
         * @returns {Number}
         */

    }, {
        key: "readU16",
        value: function readU16() {
            this.assert(this.offset + 2 <= this.data.length);
            var ret = this.data.readUInt16LE(this.offset, true);
            this.offset += 2;
            return ret;
        }
        /**
         * Read uint16be.
         * @returns {Number}
         */

    }, {
        key: "readU16BE",
        value: function readU16BE() {
            this.assert(this.offset + 2 <= this.data.length);
            var ret = this.data.readUInt16BE(this.offset, true);
            this.offset += 2;
            return ret;
        }
        /**
         * Read uint32le.
         * @returns {Number}
         */

    }, {
        key: "readU32",
        value: function readU32() {
            this.assert(this.offset + 4 <= this.data.length);
            var ret = this.data.readUInt32LE(this.offset, true);
            this.offset += 4;
            return ret;
        }
        /**
         * Read uint32be.
         * @returns {Number}
         */

    }, {
        key: "readU32BE",
        value: function readU32BE() {
            this.assert(this.offset + 4 <= this.data.length);
            var ret = this.data.readUInt32BE(this.offset, true);
            this.offset += 4;
            return ret;
        }
        /**
         * Read uint64le as a js number.
         * @returns {Number}
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: "readU64",
        value: function readU64() {
            this.assert(this.offset + 8 <= this.data.length);
            var ret = encoding_1.Encoding.readU64(this.data, this.offset);
            this.offset += 8;
            return ret;
        }
        /**
         * Read uint64be as a js number.
         * @returns {Number}
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: "readU64BE",
        value: function readU64BE() {
            this.assert(this.offset + 8 <= this.data.length);
            var ret = encoding_1.Encoding.readU64BE(this.data, this.offset);
            this.offset += 8;
            return ret;
        }
        /**
         * Read int8.
         * @returns {Number}
         */

    }, {
        key: "readI8",
        value: function readI8() {
            this.assert(this.offset + 1 <= this.data.length);
            var ret = this.data.readInt8(this.offset, true);
            this.offset += 1;
            return ret;
        }
        /**
         * Read int16le.
         * @returns {Number}
         */

    }, {
        key: "readI16",
        value: function readI16() {
            this.assert(this.offset + 2 <= this.data.length);
            var ret = this.data.readInt16LE(this.offset, true);
            this.offset += 2;
            return ret;
        }
        /**
         * Read int16be.
         * @returns {Number}
         */

    }, {
        key: "readI16BE",
        value: function readI16BE() {
            this.assert(this.offset + 2 <= this.data.length);
            var ret = this.data.readInt16BE(this.offset, true);
            this.offset += 2;
            return ret;
        }
        /**
         * Read int32le.
         * @returns {Number}
         */

    }, {
        key: "readI32",
        value: function readI32() {
            this.assert(this.offset + 4 <= this.data.length);
            var ret = this.data.readInt32LE(this.offset, true);
            this.offset += 4;
            return ret;
        }
        /**
         * Read int32be.
         * @returns {Number}
         */

    }, {
        key: "readI32BE",
        value: function readI32BE() {
            this.assert(this.offset + 4 <= this.data.length);
            var ret = this.data.readInt32BE(this.offset, true);
            this.offset += 4;
            return ret;
        }
        /**
         * Read int64le as a js number.
         * @returns {Number}
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: "readI64",
        value: function readI64() {
            this.assert(this.offset + 8 <= this.data.length);
            var ret = encoding_1.Encoding.readI64(this.data, this.offset);
            this.offset += 8;
            return ret;
        }
        /**
         * Read int64be as a js number.
         * @returns {Number}
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: "readI64BE",
        value: function readI64BE() {
            this.assert(this.offset + 8 <= this.data.length);
            var ret = encoding_1.Encoding.readI64BE(this.data, this.offset);
            this.offset += 8;
            return ret;
        }
        /**
         * Read float le.
         * @returns {Number}
         */

    }, {
        key: "readFloat",
        value: function readFloat() {
            this.assert(this.offset + 4 <= this.data.length);
            var ret = this.data.readFloatLE(this.offset, true);
            this.offset += 4;
            return ret;
        }
        /**
         * Read float be.
         * @returns {Number}
         */

    }, {
        key: "readFloatBE",
        value: function readFloatBE() {
            this.assert(this.offset + 4 <= this.data.length);
            var ret = this.data.readFloatBE(this.offset, true);
            this.offset += 4;
            return ret;
        }
        /**
         * Read double float le.
         * @returns {Number}
         */

    }, {
        key: "readDouble",
        value: function readDouble() {
            this.assert(this.offset + 8 <= this.data.length);
            var ret = this.data.readDoubleLE(this.offset, true);
            this.offset += 8;
            return ret;
        }
        /**
         * Read double float be.
         * @returns {Number}
         */

    }, {
        key: "readDoubleBE",
        value: function readDoubleBE() {
            this.assert(this.offset + 8 <= this.data.length);
            var ret = this.data.readDoubleBE(this.offset, true);
            this.offset += 8;
            return ret;
        }
        /**
         * Read a varint.
         * @returns {Number}
         */

    }, {
        key: "readVarint",
        value: function readVarint() {
            var _encoding_1$Encoding$ = encoding_1.Encoding.readVarint(this.data, this.offset),
                size = _encoding_1$Encoding$.size,
                value = _encoding_1$Encoding$.value;

            this.offset += size;
            return value;
        }
        /**
         * Read a varint (type 2).
         * @returns {Number}
         */

    }, {
        key: "readVarint2",
        value: function readVarint2() {
            var _encoding_1$Encoding$2 = encoding_1.Encoding.readVarint2(this.data, this.offset),
                size = _encoding_1$Encoding$2.size,
                value = _encoding_1$Encoding$2.value;

            this.offset += size;
            return value;
        }
        /**
         * Read N bytes (will do a fast slice if zero copy).
         * @param {Number} size
         * @param {Bolean?} zeroCopy - Do a fast buffer
         * slice instead of allocating a new buffer (warning:
         * may cause memory leaks if not used with care).
         * @returns {Buffer}
         */

    }, {
        key: "readBytes",
        value: function readBytes(size, zeroCopy) {
            _assert(size >= 0);
            this.assert(this.offset + size <= this.data.length);
            var ret = void 0;
            if (this.zeroCopy || zeroCopy) {
                ret = this.data.slice(this.offset, this.offset + size);
            } else {
                ret = Buffer.allocUnsafe(size);
                this.data.copy(ret, 0, this.offset, this.offset + size);
            }
            this.offset += size;
            return ret;
        }
        /**
         * Read a varint number of bytes (will do a fast slice if zero copy).
         * @param {Bolean?} zeroCopy - Do a fast buffer
         * slice instead of allocating a new buffer (warning:
         * may cause memory leaks if not used with care).
         * @returns {Buffer}
         */

    }, {
        key: "readVarBytes",
        value: function readVarBytes(zeroCopy) {
            return this.readBytes(this.readVarint(), zeroCopy);
        }
        /**
         * Read a string.
         * @param {String} enc - Any buffer-supported Encoding.
         * @param {Number} size
         * @returns {String}
         */

    }, {
        key: "readString",
        value: function readString(enc, size) {
            _assert(size >= 0);
            this.assert(this.offset + size <= this.data.length);
            var ret = this.data.toString(enc, this.offset, this.offset + size);
            this.offset += size;
            return ret;
        }
    }, {
        key: "readHash",
        value: function readHash(enc) {
            if (enc) {
                return this.readString(enc, 32);
            }
            return this.readBytes(32);
        }
        /**
         * Read string of a varint length.
         * @param {String} enc - Any buffer-supported Encoding.
         * @param {Number?} limit - Size limit.
         * @returns {String}
         */

    }, {
        key: "readVarString",
        value: function readVarString(enc, limit) {
            var size = this.readVarint();
            this.enforce(!limit || size <= limit, 'String exceeds limit.');
            return this.readString(enc, size);
        }
    }, {
        key: "readBigNumber",
        value: function readBigNumber() {
            var str = this.readVarString();
            return new bignumber_js_1.BigNumber(str);
        }
        /**
         * Read a null-terminated string.
         * @param {String} enc - Any buffer-supported Encoding.
         * @returns {String}
         */

    }, {
        key: "readNullString",
        value: function readNullString(enc) {
            this.assert(this.offset + 1 <= this.data.length);
            var i = this.offset;
            for (; i < this.data.length; i++) {
                if (this.data[i] === 0) {
                    break;
                }
            }
            this.assert(i !== this.data.length);
            var ret = this.readString(enc, i - this.offset);
            this.offset = i + 1;
            return ret;
        }
        /**
         * Create a checksum from the last start position.
         * @returns {Number} Checksum.
         */

    }, {
        key: "createChecksum",
        value: function createChecksum() {
            var start = 0;
            if (this.stack.length > 0) {
                start = this.stack[this.stack.length - 1];
            }
            var data = this.data.slice(start, this.offset);
            return digest.hash256(data).readUInt32LE(0, true);
        }
        /**
         * Verify a 4-byte checksum against a calculated checksum.
         * @returns {Number} checksum
         * @throws on bad checksum
         */

    }, {
        key: "verifyChecksum",
        value: function verifyChecksum() {
            var chk = this.createChecksum();
            var checksum = this.readU32();
            this.enforce(chk === checksum, 'Checksum mismatch.');
            return checksum;
        }
    }]);
    return BufferReader;
}();

exports.BufferReader = BufferReader;