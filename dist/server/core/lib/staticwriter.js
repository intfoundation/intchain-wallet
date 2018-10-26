/*!
 * staticwriter.js - buffer writer for bcoin
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
var assert = require("assert");
var encoding_1 = require("./encoding");
var digest = require("./digest");
var EMPTY = Buffer.alloc(0);
var POOLSIZE = 100 << 10;
var POOL = null;
/**
 * Statically allocated buffer writer.
 * @alias module:utils.StaticWriter
 * @constructor
 * @param {Number} size
 */

var StaticWriter = function () {
    function StaticWriter(size) {
        (0, _classCallCheck3.default)(this, StaticWriter);

        if (!(this instanceof StaticWriter)) return new StaticWriter(size);
        this.data = size ? Buffer.allocUnsafe(size) : EMPTY;
        this.offset = 0;
    }
    /**
     * Allocate writer from preallocated 100kb pool.
     * @param {Number} size
     * @returns {StaticWriter}
     */


    (0, _createClass3.default)(StaticWriter, [{
        key: "render",

        /**
         * Allocate and render the final buffer.
         * @returns {Buffer} Rendered buffer.
         */
        value: function render() {
            var data = this.data;
            assert(this.offset === data.length);
            this.destroy();
            return data;
        }
    }, {
        key: "getSize",

        /**
         * Get size of data written so far.
         * @returns {Number}
         */
        value: function getSize() {
            return this.offset;
        }
    }, {
        key: "seek",

        /**
         * Seek to relative offset.
         * @param {Number} offset
         */
        value: function seek(offset) {
            this.offset += offset;
        }
    }, {
        key: "destroy",

        /**
         * Destroy the buffer writer.
         */
        value: function destroy() {
            this.data = EMPTY;
            this.offset = 0;
        }
    }, {
        key: "writeU8",

        /**
         * Write uint8.
         * @param {Number} value
         */
        value: function writeU8(value) {
            this.offset = this.data.writeUInt8(value, this.offset, true);
        }
    }, {
        key: "writeU16",

        /**
         * Write uint16le.
         * @param {Number} value
         */
        value: function writeU16(value) {
            this.offset = this.data.writeUInt16LE(value, this.offset, true);
        }
    }, {
        key: "writeU16BE",

        /**
         * Write uint16be.
         * @param {Number} value
         */
        value: function writeU16BE(value) {
            this.offset = this.data.writeUInt16BE(value, this.offset, true);
        }
    }, {
        key: "writeU32",

        /**
         * Write uint32le.
         * @param {Number} value
         */
        value: function writeU32(value) {
            this.offset = this.data.writeUInt32LE(value, this.offset, true);
        }
    }, {
        key: "writeU32BE",

        /**
         * Write uint32be.
         * @param {Number} value
         */
        value: function writeU32BE(value) {
            this.offset = this.data.writeUInt32BE(value, this.offset, true);
        }
    }, {
        key: "writeU64",

        /**
         * Write uint64le.
         * @param {Number} value
         */
        value: function writeU64(value) {
            this.offset = encoding_1.Encoding.writeU64(this.data, value, this.offset);
        }
    }, {
        key: "writeU64BE",

        /**
         * Write uint64be.
         * @param {Number} value
         */
        value: function writeU64BE(value) {
            this.offset = encoding_1.Encoding.writeU64BE(this.data, value, this.offset);
        }
    }, {
        key: "writeI8",

        /**
         * Write int8.
         * @param {Number} value
         */
        value: function writeI8(value) {
            this.offset = this.data.writeInt8(value, this.offset, true);
        }
    }, {
        key: "writeI16",

        /**
         * Write int16le.
         * @param {Number} value
         */
        value: function writeI16(value) {
            this.offset = this.data.writeInt16LE(value, this.offset, true);
        }
    }, {
        key: "writeI16BE",

        /**
         * Write int16be.
         * @param {Number} value
         */
        value: function writeI16BE(value) {
            this.offset = this.data.writeInt16BE(value, this.offset, true);
        }
    }, {
        key: "writeI32",

        /**
         * Write int32le.
         * @param {Number} value
         */
        value: function writeI32(value) {
            this.offset = this.data.writeInt32LE(value, this.offset, true);
        }
    }, {
        key: "writeI32BE",

        /**
         * Write int32be.
         * @param {Number} value
         */
        value: function writeI32BE(value) {
            this.offset = this.data.writeInt32BE(value, this.offset, true);
        }
    }, {
        key: "writeI64",

        /**
         * Write int64le.
         * @param {Number} value
         */
        value: function writeI64(value) {
            this.offset = encoding_1.Encoding.writeI64(this.data, value, this.offset);
        }
    }, {
        key: "writeI64BE",

        /**
         * Write int64be.
         * @param {Number} value
         */
        value: function writeI64BE(value) {
            this.offset = encoding_1.Encoding.writeI64BE(this.data, value, this.offset);
        }
    }, {
        key: "writeFloat",

        /**
         * Write float le.
         * @param {Number} value
         */
        value: function writeFloat(value) {
            this.offset = this.data.writeFloatLE(value, this.offset, true);
        }
    }, {
        key: "writeFloatBE",

        /**
         * Write float be.
         * @param {Number} value
         */
        value: function writeFloatBE(value) {
            this.offset = this.data.writeFloatBE(value, this.offset, true);
        }
    }, {
        key: "writeDouble",

        /**
         * Write double le.
         * @param {Number} value
         */
        value: function writeDouble(value) {
            this.offset = this.data.writeDoubleLE(value, this.offset, true);
        }
    }, {
        key: "writeDoubleBE",

        /**
         * Write double be.
         * @param {Number} value
         */
        value: function writeDoubleBE(value) {
            this.offset = this.data.writeDoubleBE(value, this.offset, true);
        }
    }, {
        key: "writeVarint",

        /**
         * Write a varint.
         * @param {Number} value
         */
        value: function writeVarint(value) {
            this.offset = encoding_1.Encoding.writeVarint(this.data, value, this.offset);
        }
    }, {
        key: "writeVarint2",

        /**
         * Write a varint (type 2).
         * @param {Number} value
         */
        value: function writeVarint2(value) {
            this.offset = encoding_1.Encoding.writeVarint2(this.data, value, this.offset);
        }
    }, {
        key: "writeBytes",

        /**
         * Write bytes.
         * @param {Buffer} value
         */
        value: function writeBytes(value) {
            if (value.length === 0) return;
            value.copy(this.data, this.offset);
            this.offset += value.length;
        }
    }, {
        key: "writeVarBytes",

        /**
         * Write bytes with a varint length before them.
         * @param {Buffer} value
         */
        value: function writeVarBytes(value) {
            this.writeVarint(value.length);
            this.writeBytes(value);
        }
    }, {
        key: "copy",

        /**
         * Copy bytes.
         * @param {Buffer} value
         * @param {Number} start
         * @param {Number} end
         */
        value: function copy(value, start, end) {
            var len = end - start;
            if (len === 0) return;
            value.copy(this.data, this.offset, start, end);
            this.offset += len;
        }
    }, {
        key: "writeString",

        /**
         * Write string to buffer.
         * @param {String} value
         * @param {String?} enc - Any buffer-supported encoding.
         */
        value: function writeString(value, enc) {
            if (value.length === 0) return;
            var size = Buffer.byteLength(value, enc);
            this.data.write(value, this.offset, undefined, enc);
            this.offset += size;
        }
    }, {
        key: "writeHash",

        /**
         * Write a 32 byte hash.
         * @param {Hash} value
         */
        value: function writeHash(value) {
            if (typeof value !== 'string') {
                assert(value.length === 32);
                this.writeBytes(value);
                return;
            }
            assert(value.length === 64);
            this.data.write(value, this.offset, undefined, 'hex');
            this.offset += 32;
        }
    }, {
        key: "writeVarString",

        /**
         * Write a string with a varint length before it.
         * @param {String}
         * @param {String?} enc - Any buffer-supported encoding.
         */
        value: function writeVarString(value, enc) {
            if (value.length === 0) {
                this.writeVarint(0);
                return;
            }
            var size = Buffer.byteLength(value, enc);
            this.writeVarint(size);
            this.data.write(value, this.offset, undefined, enc);
            this.offset += size;
        }
    }, {
        key: "writeNullString",

        /**
         * Write a null-terminated string.
         * @param {String|Buffer}
         * @param {String?} enc - Any buffer-supported encoding.
         */
        value: function writeNullString(value, enc) {
            this.writeString(value, enc);
            this.writeU8(0);
        }
    }, {
        key: "writeChecksum",

        /**
         * Calculate and write a checksum for the data written so far.
         */
        value: function writeChecksum() {
            var data = this.data.slice(0, this.offset);
            var hash = digest.hash256(data);
            hash.copy(this.data, this.offset, 0, 4);
            this.offset += 4;
        }
    }, {
        key: "fill",

        /**
         * Fill N bytes with value.
         * @param {Number} value
         * @param {Number} size
         */
        value: function fill(value, size) {
            assert(size >= 0);
            if (size === 0) return;
            this.data.fill(value, this.offset, this.offset + size);
            this.offset += size;
        }
    }], [{
        key: "pool",
        value: function pool(size) {
            if (size <= POOLSIZE) {
                if (!POOL) POOL = Buffer.allocUnsafeSlow(POOLSIZE);
                var bw = new StaticWriter(0);
                bw.data = POOL.slice(0, size);
                return bw;
            }
            return new StaticWriter(size);
        }
    }]);
    return StaticWriter;
}();

exports.StaticWriter = StaticWriter;