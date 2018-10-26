/*!
 * writer.js - buffer writer for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
'use strict';

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var encoding_1 = require("./encoding");
var digest = require("./digest");
/*
 * Constants
 */
var SEEK = 0;
var UI8 = 1;
var UI16 = 2;
var UI16BE = 3;
var UI32 = 4;
var UI32BE = 5;
var UI64 = 6;
var UI64BE = 7;
var I8 = 10;
var I16 = 11;
var I16BE = 12;
var I32 = 13;
var I32BE = 14;
var I64 = 15;
var I64BE = 16;
var FL = 19;
var FLBE = 20;
var DBL = 21;
var DBLBE = 22;
var VARINT = 23;
var VARINT2 = 25;
var BYTES = 27;
var STR = 28;
var CHECKSUM = 29;
var FILL = 30;
/**
 * An object that allows writing of buffers in a
 * sane manner. This buffer writer is extremely
 * optimized since it does not actually write
 * anything until `render` is called. It makes
 * one allocation: at the end, once it knows the
 * size of the buffer to be allocated. Because
 * of this, it can also act as a size calculator
 * which is useful for guaging block size
 * without actually serializing any data.
 * @alias module:utils.BufferWriter
 * @constructor
 */

var BufferWriter = function () {
    function BufferWriter() {
        (0, _classCallCheck3.default)(this, BufferWriter);

        if (!(this instanceof BufferWriter)) {
            return new BufferWriter();
        }
        this.ops = [];
        this.offset = 0;
    }
    /**
     * Allocate and render the final buffer.
     * @returns {Buffer} Rendered buffer.
     */


    (0, _createClass3.default)(BufferWriter, [{
        key: "render",
        value: function render() {
            var data = Buffer.allocUnsafe(this.offset);
            var off = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.ops), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var op = _step.value;

                    switch (op.type) {
                        case SEEK:
                            off += op.value;
                            break;
                        case UI8:
                            off = data.writeUInt8(op.value, off, true);
                            break;
                        case UI16:
                            off = data.writeUInt16LE(op.value, off, true);
                            break;
                        case UI16BE:
                            off = data.writeUInt16BE(op.value, off, true);
                            break;
                        case UI32:
                            off = data.writeUInt32LE(op.value, off, true);
                            break;
                        case UI32BE:
                            off = data.writeUInt32BE(op.value, off, true);
                            break;
                        case UI64:
                            off = encoding_1.Encoding.writeU64(data, op.value, off);
                            break;
                        case UI64BE:
                            off = encoding_1.Encoding.writeU64BE(data, op.value, off);
                            break;
                        case I8:
                            off = data.writeInt8(op.value, off, true);
                            break;
                        case I16:
                            off = data.writeInt16LE(op.value, off, true);
                            break;
                        case I16BE:
                            off = data.writeInt16BE(op.value, off, true);
                            break;
                        case I32:
                            off = data.writeInt32LE(op.value, off, true);
                            break;
                        case I32BE:
                            off = data.writeInt32BE(op.value, off, true);
                            break;
                        case I64:
                            off = encoding_1.Encoding.writeI64(data, op.value, off);
                            break;
                        case I64BE:
                            off = encoding_1.Encoding.writeI64BE(data, op.value, off);
                            break;
                        case FL:
                            off = data.writeFloatLE(op.value, off, true);
                            break;
                        case FLBE:
                            off = data.writeFloatBE(op.value, off, true);
                            break;
                        case DBL:
                            off = data.writeDoubleLE(op.value, off, true);
                            break;
                        case DBLBE:
                            off = data.writeDoubleBE(op.value, off, true);
                            break;
                        case VARINT:
                            off = encoding_1.Encoding.writeVarint(data, op.value, off);
                            break;
                        case VARINT2:
                            off = encoding_1.Encoding.writeVarint2(data, op.value, off);
                            break;
                        case BYTES:
                            off += op.value.copy(data, off);
                            break;
                        case STR:
                            off += data.write(op.value, off, op.enc);
                            break;
                        case CHECKSUM:
                            off += digest.hash256(data.slice(0, off)).copy(data, off, 0, 4);
                            break;
                        case FILL:
                            data.fill(op.value, off, off + op.size);
                            off += op.size;
                            break;
                        default:
                            assert(false, 'Bad type.');
                            break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            assert(off === data.length);
            this.destroy();
            return data;
        }
        /**
         * Get size of data written so far.
         * @returns {Number}
         */

    }, {
        key: "getSize",
        value: function getSize() {
            return this.offset;
        }
        /**
         * Seek to relative offset.
         * @param {Number} offset
         */

    }, {
        key: "seek",
        value: function seek(offset) {
            this.offset += offset;
            this.ops.push(new WriteOp(SEEK, offset));
        }
        /**
         * Destroy the buffer writer. Remove references to `ops`.
         */

    }, {
        key: "destroy",
        value: function destroy() {
            this.ops.length = 0;
            this.offset = 0;
        }
        /**
         * Write uint8.
         * @param {Number} value
         */

    }, {
        key: "writeU8",
        value: function writeU8(value) {
            this.offset += 1;
            this.ops.push(new WriteOp(UI8, value));
        }
        /**
         * Write uint16le.
         * @param {Number} value
         */

    }, {
        key: "writeU16",
        value: function writeU16(value) {
            this.offset += 2;
            this.ops.push(new WriteOp(UI16, value));
        }
        /**
         * Write uint16be.
         * @param {Number} value
         */

    }, {
        key: "writeU16BE",
        value: function writeU16BE(value) {
            this.offset += 2;
            this.ops.push(new WriteOp(UI16BE, value));
        }
        /**
         * Write uint32le.
         * @param {Number} value
         */

    }, {
        key: "writeU32",
        value: function writeU32(value) {
            this.offset += 4;
            this.ops.push(new WriteOp(UI32, value));
        }
        /**
         * Write uint32be.
         * @param {Number} value
         */

    }, {
        key: "writeU32BE",
        value: function writeU32BE(value) {
            this.offset += 4;
            this.ops.push(new WriteOp(UI32BE, value));
        }
        /**
         * Write uint64le.
         * @param {Number} value
         */

    }, {
        key: "writeU64",
        value: function writeU64(value) {
            this.offset += 8;
            this.ops.push(new WriteOp(UI64, value));
        }
        /**
         * Write uint64be.
         * @param {Number} value
         */

    }, {
        key: "writeU64BE",
        value: function writeU64BE(value) {
            this.offset += 8;
            this.ops.push(new WriteOp(UI64BE, value));
        }
        /**
         * Write int8.
         * @param {Number} value
         */

    }, {
        key: "writeI8",
        value: function writeI8(value) {
            this.offset += 1;
            this.ops.push(new WriteOp(I8, value));
        }
        /**
         * Write int16le.
         * @param {Number} value
         */

    }, {
        key: "writeI16",
        value: function writeI16(value) {
            this.offset += 2;
            this.ops.push(new WriteOp(I16, value));
        }
        /**
         * Write int16be.
         * @param {Number} value
         */

    }, {
        key: "writeI16BE",
        value: function writeI16BE(value) {
            this.offset += 2;
            this.ops.push(new WriteOp(I16BE, value));
        }
        /**
         * Write int32le.
         * @param {Number} value
         */

    }, {
        key: "writeI32",
        value: function writeI32(value) {
            this.offset += 4;
            this.ops.push(new WriteOp(I32, value));
        }
        /**
         * Write int32be.
         * @param {Number} value
         */

    }, {
        key: "writeI32BE",
        value: function writeI32BE(value) {
            this.offset += 4;
            this.ops.push(new WriteOp(I32BE, value));
        }
        /**
         * Write int64le.
         * @param {Number} value
         */

    }, {
        key: "writeI64",
        value: function writeI64(value) {
            this.offset += 8;
            this.ops.push(new WriteOp(I64, value));
        }
        /**
         * Write int64be.
         * @param {Number} value
         */

    }, {
        key: "writeI64BE",
        value: function writeI64BE(value) {
            this.offset += 8;
            this.ops.push(new WriteOp(I64BE, value));
        }
        /**
         * Write float le.
         * @param {Number} value
         */

    }, {
        key: "writeFloat",
        value: function writeFloat(value) {
            this.offset += 4;
            this.ops.push(new WriteOp(FL, value));
        }
        /**
         * Write float be.
         * @param {Number} value
         */

    }, {
        key: "writeFloatBE",
        value: function writeFloatBE(value) {
            this.offset += 4;
            this.ops.push(new WriteOp(FLBE, value));
        }
        /**
         * Write double le.
         * @param {Number} value
         */

    }, {
        key: "writeDouble",
        value: function writeDouble(value) {
            this.offset += 8;
            this.ops.push(new WriteOp(DBL, value));
        }
        /**
         * Write double be.
         * @param {Number} value
         */

    }, {
        key: "writeDoubleBE",
        value: function writeDoubleBE(value) {
            this.offset += 8;
            this.ops.push(new WriteOp(DBLBE, value));
        }
        /**
         * Write a varint.
         * @param {Number} value
         */

    }, {
        key: "writeVarint",
        value: function writeVarint(value) {
            this.offset += encoding_1.Encoding.sizeVarint(value);
            this.ops.push(new WriteOp(VARINT, value));
        }
        /**
         * Write a varint (type 2).
         * @param {Number} value
         */

    }, {
        key: "writeVarint2",
        value: function writeVarint2(value) {
            this.offset += encoding_1.Encoding.sizeVarint2(value);
            this.ops.push(new WriteOp(VARINT2, value));
        }
        /**
         * Write bytes.
         * @param {Buffer} value
         */

    }, {
        key: "writeBytes",
        value: function writeBytes(value) {
            if (value.length === 0) {
                return;
            }
            this.offset += value.length;
            this.ops.push(new WriteOp(BYTES, value));
        }
        /**
         * Write bytes with a varint length before them.
         * @param {Buffer} value
         */

    }, {
        key: "writeVarBytes",
        value: function writeVarBytes(value) {
            this.offset += encoding_1.Encoding.sizeVarint(value.length);
            this.ops.push(new WriteOp(VARINT, value.length));
            if (value.length === 0) {
                return;
            }
            this.offset += value.length;
            this.ops.push(new WriteOp(BYTES, value));
        }
    }, {
        key: "writeBigNumber",
        value: function writeBigNumber(value) {
            return this.writeVarString(value.toString());
        }
        /**
         * Copy bytes.
         * @param {Buffer} value
         * @param {Number} start
         * @param {Number} end
         */

    }, {
        key: "copy",
        value: function copy(value, start, end) {
            assert(end >= start);
            value = value.slice(start, end);
            this.writeBytes(value);
        }
        /**
         * Write string to buffer.
         * @param {String} value
         * @param {String?} enc - Any buffer-supported Encoding.
         */

    }, {
        key: "writeString",
        value: function writeString(value, enc) {
            if (value.length === 0) {
                return;
            }
            this.offset += Buffer.byteLength(value, enc);
            this.ops.push(new WriteOp(STR, value, enc));
        }
        /**
         * Write a 32 byte hash.
         * @param {Hash} value
         */

    }, {
        key: "writeHash",
        value: function writeHash(value) {
            if (typeof value !== 'string') {
                assert(value.length === 32);
                this.writeBytes(value);
                return;
            }
            assert(value.length === 64);
            this.writeString(value, 'hex');
        }
        /**
         * Write a string with a varint length before it.
         * @param {String}
         * @param {String?} enc - Any buffer-supported Encoding.
         */

    }, {
        key: "writeVarString",
        value: function writeVarString(value, enc) {
            if (value.length === 0) {
                this.offset += encoding_1.Encoding.sizeVarint(0);
                this.ops.push(new WriteOp(VARINT, 0));
                return;
            }
            var size = Buffer.byteLength(value, enc);
            this.offset += encoding_1.Encoding.sizeVarint(size);
            this.offset += size;
            this.ops.push(new WriteOp(VARINT, size));
            this.ops.push(new WriteOp(STR, value, enc));
        }
        /**
         * Write a null-terminated string.
         * @param {String|Buffer}
         * @param {String?} enc - Any buffer-supported Encoding.
         */

    }, {
        key: "writeNullString",
        value: function writeNullString(value, enc) {
            this.writeString(value, enc);
            this.writeU8(0);
        }
        /**
         * Calculate and write a checksum for the data written so far.
         */

    }, {
        key: "writeChecksum",
        value: function writeChecksum() {
            this.offset += 4;
            this.ops.push(new WriteOp(CHECKSUM));
        }
        /**
         * Fill N bytes with value.
         * @param {Number} value
         * @param {Number} size
         */

    }, {
        key: "fill",
        value: function fill(value, size) {
            assert(size >= 0);
            if (size === 0) {
                return;
            }
            this.offset += size;
            this.ops.push(new WriteOp(FILL, value, null, size));
        }
    }]);
    return BufferWriter;
}();

exports.BufferWriter = BufferWriter;
/*
 * Helpers
 */

var WriteOp = function WriteOp(type, value, enc, size) {
    (0, _classCallCheck3.default)(this, WriteOp);

    this.type = type;
    this.value = value;
    this.enc = enc;
    this.size = size;
};