/*!
 * encoding.js - encoding utils for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _maxSafeInteger = require('babel-runtime/core-js/number/max-safe-integer');

var _maxSafeInteger2 = _interopRequireDefault(_maxSafeInteger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module utils/encoding
 */
var MAX_SAFE_INTEGER = _maxSafeInteger2.default;

var Encoding = function () {
    function Encoding() {
        (0, _classCallCheck3.default)(this, Encoding);
    }

    (0, _createClass3.default)(Encoding, null, [{
        key: 'readU64',

        /**
         * Read uint64le as a js number.
         * @param {Buffer} data
         * @param {Number} off
         * @returns {Number}
         * @throws on num > MAX_SAFE_INTEGER
         */
        value: function readU64(data, off) {
            var hi = data.readUInt32LE(off + 4, true);
            var lo = data.readUInt32LE(off, true);
            enforce((hi & 0xffe00000) === 0, off, 'Number exceeds 2^53-1');
            return hi * 0x100000000 + lo;
        }
        /**
         * Read uint64be as a js number.
         * @param {Buffer} data
         * @param {Number} off
         * @returns {Number}
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: 'readU64BE',
        value: function readU64BE(data, off) {
            var hi = data.readUInt32BE(off, true);
            var lo = data.readUInt32BE(off + 4, true);
            enforce((hi & 0xffe00000) === 0, off, 'Number exceeds 2^53-1');
            return hi * 0x100000000 + lo;
        }
        /**
         * Read int64be as a js number.
         * @param {Buffer} data
         * @param {Number} off
         * @returns {Number}
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: 'readI64',
        value: function readI64(data, off) {
            var hi = data.readInt32LE(off + 4, true);
            var lo = data.readUInt32LE(off, true);
            enforce(isSafe(hi, lo), 'Number exceeds 2^53-1');
            return hi * 0x100000000 + lo;
        }
        /**
         * Read int64be as a js number.
         * @param {Buffer} data
         * @param {Number} off
         * @returns {Number}
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: 'readI64BE',
        value: function readI64BE(data, off) {
            var hi = data.readInt32BE(off, true);
            var lo = data.readUInt32BE(off + 4, true);
            enforce(isSafe(hi, lo), 'Number exceeds 2^53-1');
            return hi * 0x100000000 + lo;
        }
        /**
         * Write a javascript number as a uint64le.
         * @param {Buffer} dst
         * @param {Number} num
         * @param {Number} off
         * @returns {Number} Buffer offset.
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: 'writeU64',
        value: function writeU64(dst, num, off) {
            return write64(dst, num, off, false);
        }
        /**
         * Write a javascript number as a uint64be.
         * @param {Buffer} dst
         * @param {Number} num
         * @param {Number} off
         * @returns {Number} Buffer offset.
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: 'writeU64BE',
        value: function writeU64BE(dst, num, off) {
            return write64(dst, num, off, true);
        }
        /**
         * Write a javascript number as an int64le.
         * @param {Buffer} dst
         * @param {Number} num
         * @param {Number} off
         * @returns {Number} Buffer offset.
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: 'writeI64',
        value: function writeI64(dst, num, off) {
            return write64(dst, num, off, false);
        }
        /**
         * Write a javascript number as an int64be.
         * @param {Buffer} dst
         * @param {Number} num
         * @param {Number} off
         * @returns {Number} Buffer offset.
         * @throws on num > MAX_SAFE_INTEGER
         */

    }, {
        key: 'writeI64BE',
        value: function writeI64BE(dst, num, off) {
            return write64(dst, num, off, true);
        }
        /**
         * Read a varint.
         * @param {Buffer} data
         * @param {Number} off
         * @returns {Object}
         */

    }, {
        key: 'readVarint',
        value: function readVarint(data, off) {
            var value = void 0,
                size = void 0;
            assert(off < data.length, off);
            switch (data[off]) {
                case 0xff:
                    size = 9;
                    assert(off + size <= data.length, off);
                    value = Encoding.readU64(data, off + 1);
                    enforce(value > 0xffffffff, off, 'Non-canonical varint');
                    break;
                case 0xfe:
                    size = 5;
                    assert(off + size <= data.length, off);
                    value = data.readUInt32LE(off + 1, true);
                    enforce(value > 0xffff, off, 'Non-canonical varint');
                    break;
                case 0xfd:
                    size = 3;
                    assert(off + size <= data.length, off);
                    value = data[off + 1] | data[off + 2] << 8;
                    enforce(value >= 0xfd, off, 'Non-canonical varint');
                    break;
                default:
                    size = 1;
                    value = data[off];
                    break;
            }
            return new Varint(size, value);
        }
        /**
         * Write a varint.
         * @param {Buffer} dst
         * @param {Number} num
         * @param {Number} off
         * @returns {Number} Buffer offset.
         */

    }, {
        key: 'writeVarint',
        value: function writeVarint(dst, num, off) {
            if (num < 0xfd) {
                dst[off++] = num & 0xff;
                return off;
            }
            if (num <= 0xffff) {
                dst[off++] = 0xfd;
                dst[off++] = num & 0xff;
                dst[off++] = num >> 8 & 0xff;
                return off;
            }
            if (num <= 0xffffffff) {
                dst[off++] = 0xfe;
                dst[off++] = num & 0xff;
                dst[off++] = num >> 8 & 0xff;
                dst[off++] = num >> 16 & 0xff;
                dst[off++] = num >>> 24;
                return off;
            }
            dst[off++] = 0xff;
            off = Encoding.writeU64(dst, num, off);
            return off;
        }
        /**
         * Calculate size of varint.
         * @param {Number} num
         * @returns {Number} size
         */

    }, {
        key: 'sizeVarint',
        value: function sizeVarint(num) {
            if (num < 0xfd) {
                return 1;
            }
            if (num <= 0xffff) {
                return 3;
            }
            if (num <= 0xffffffff) {
                return 5;
            }
            return 9;
        }
        /**
         * Read a varint (type 2).
         * @param {Buffer} data
         * @param {Number} off
         * @returns {Object}
         */

    }, {
        key: 'readVarint2',
        value: function readVarint2(data, off) {
            var num = 0;
            var size = 0;
            for (;;) {
                assert(off < data.length, off);
                var ch = data[off++];
                size++;
                // Number.MAX_SAFE_INTEGER >>> 7
                enforce(num <= 0x3fffffffffff - (ch & 0x7f), off, 'Number exceeds 2^53-1');
                // num = (num << 7) | (ch & 0x7f);
                num = num * 0x80 + (ch & 0x7f);
                if ((ch & 0x80) === 0) {
                    break;
                }
                enforce(num !== MAX_SAFE_INTEGER, off, 'Number exceeds 2^53-1');
                num++;
            }
            return new Varint(size, num);
        }
        /**
         * Write a varint (type 2).
         * @param {Buffer} dst
         * @param {Number} num
         * @param {Number} off
         * @returns {Number} Buffer offset.
         */

    }, {
        key: 'writeVarint2',
        value: function writeVarint2(dst, num, off) {
            var tmp = [];
            var len = 0;
            for (;;) {
                tmp[len] = num & 0x7f | (len ? 0x80 : 0x00);
                if (num <= 0x7f) {
                    break;
                }
                // num = (num >>> 7) - 1;
                num = (num - num % 0x80) / 0x80 - 1;
                len++;
            }
            assert(off + len + 1 <= dst.length, off);
            do {
                dst[off++] = tmp[len];
            } while (len--);
            return off;
        }
        /**
         * Calculate size of varint (type 2).
         * @param {Number} num
         * @returns {Number} size
         */

    }, {
        key: 'sizeVarint2',
        value: function sizeVarint2(num) {
            var size = 0;
            for (;;) {
                size++;
                if (num <= 0x7f) {
                    break;
                }
                // num = (num >>> 7) - 1;
                num = (num - num % 0x80) / 0x80 - 1;
            }
            return size;
        }
        /**
         * Serialize number as a u8.
         * @param {Number} num
         * @returns {Buffer}
         */

    }, {
        key: 'U8',
        value: function U8(num) {
            var data = Buffer.allocUnsafe(1);
            data[0] = num >>> 0;
            return data;
        }
        /**
         * Serialize number as a u32le.
         * @param {Number} num
         * @returns {Buffer}
         */

    }, {
        key: 'U32',
        value: function U32(num) {
            var data = Buffer.allocUnsafe(4);
            data.writeUInt32LE(num, 0, true);
            return data;
        }
        /**
         * Serialize number as a u32be.
         * @param {Number} num
         * @returns {Buffer}
         */

    }, {
        key: 'U32BE',
        value: function U32BE(num) {
            var data = Buffer.allocUnsafe(4);
            data.writeUInt32BE(num, 0, true);
            return data;
        }
        /**
         * Get size of varint-prefixed bytes.
         * @param {Buffer} data
         * @returns {Number}
         */

    }, {
        key: 'sizeVarBytes',
        value: function sizeVarBytes(data) {
            return Encoding.sizeVarint(data.length) + data.length;
        }
        /**
         * Get size of varint-prefixed length.
         * @param {Number} len
         * @returns {Number}
         */

    }, {
        key: 'sizeVarlen',
        value: function sizeVarlen(len) {
            return Encoding.sizeVarint(len) + len;
        }
        /**
         * Get size of varint-prefixed string.
         * @param {String} str
         * @returns {Number}
         */

    }, {
        key: 'sizeVarString',
        value: function sizeVarString(str, enc) {
            if (typeof str !== 'string') {
                return Encoding.sizeVarBytes(str);
            }
            var len = Buffer.byteLength(str, enc);
            return Encoding.sizeVarint(len) + len;
        }
    }]);
    return Encoding;
}();
/**
 * An empty buffer.
 * @const {Buffer}
 * @default
 */


Encoding.DUMMY = Buffer.from([0]);
/**
 * A hash of all zeroes with a `1` at the
 * end (used for the SIGHASH_SINGLE bug).
 * @const {Buffer}
 * @default
 */
Encoding.ONE_HASH = Buffer.from('0100000000000000000000000000000000000000000000000000000000000000', 'hex');
/**
 * A hash of all zeroes.
 * @const {Buffer}
 * @default
 */
Encoding.ZERO_HASH = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
/**
 * A hash of all 0xff.
 * @const {Buffer}
 * @default
 */
Encoding.MAX_HASH = Buffer.from('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'hex');
/**
 * A hash of all zeroes.
 * @const {String}
 * @default
 */
Encoding.NULL_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
/**
 * A hash of all 0xff.
 * @const {String}
 * @default
 */
Encoding.HIGH_HASH = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
/**
 * A hash of all zeroes.
 * @const {Buffer}
 * @default
 */
Encoding.ZERO_HASH160 = Buffer.from('0000000000000000000000000000000000000000', 'hex');
/**
 * A hash of all 0xff.
 * @const {String}
 * @default
 */
Encoding.MAX_HASH160 = Buffer.from('ffffffffffffffffffffffffffffffffffffffff', 'hex');
/**
 * A hash of all zeroes.
 * @const {String}
 * @default
 */
Encoding.NULL_HASH160 = '0000000000000000000000000000000000000000';
/**
 * A hash of all 0xff.
 * @const {String}
 * @default
 */
Encoding.HIGH_HASH160 = 'ffffffffffffffffffffffffffffffffffffffff';
/**
 * A compressed pubkey of all zeroes.
 * @const {Buffer}
 * @default
 */
Encoding.ZERO_KEY = Buffer.from('000000000000000000000000000000000000000000000000000000000000000000', 'hex');
/**
 * A 73 byte signature of all zeroes.
 * @const {Buffer}
 * @default
 */
Encoding.ZERO_SIG = Buffer.from('' + '0000000000000000000000000000000000000000000000000000000000000000' + '0000000000000000000000000000000000000000000000000000000000000000' + '000000000000000000', 'hex');
/**
 * A 64 byte signature of all zeroes.
 * @const {Buffer}
 * @default
 */
Encoding.ZERO_SIG64 = Buffer.from('' + '0000000000000000000000000000000000000000000000000000000000000000' + '0000000000000000000000000000000000000000000000000000000000000000', 'hex');
/**
 * 4 zero bytes.
 * @const {Buffer}
 * @default
 */
Encoding.ZERO_U32 = Buffer.from('00000000', 'hex');
/**
 * 8 zero bytes.
 * @const {Buffer}
 * @default
 */
Encoding.ZERO_U64 = Buffer.from('0000000000000000', 'hex');
exports.Encoding = Encoding;
/*
 * Helpers
 */
function isSafe(hi, lo) {
    if (hi < 0) {
        hi = ~hi;
        if (lo === 0) {
            hi += 1;
        }
    }
    return (hi & 0xffe00000) === 0;
}
function write64(dst, num, off, be) {
    var neg = false;
    if (num < 0) {
        num = -num;
        neg = true;
    }
    var hi = num * (1 / 0x100000000) | 0;
    var lo = num | 0;
    if (neg) {
        if (lo === 0) {
            hi = ~hi + 1 | 0;
        } else {
            hi = ~hi;
            lo = ~lo + 1;
        }
    }
    if (be) {
        off = dst.writeInt32BE(hi, off, true);
        off = dst.writeInt32BE(lo, off, true);
    } else {
        off = dst.writeInt32LE(lo, off, true);
        off = dst.writeInt32LE(hi, off, true);
    }
    return off;
}
/**
 * EncodingError
 * @constructor
 * @param {Number} offset
 * @param {String} reason
 */

var EncodingError = function (_Error) {
    (0, _inherits3.default)(EncodingError, _Error);

    function EncodingError(offset, reason, start) {
        (0, _classCallCheck3.default)(this, EncodingError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (EncodingError.__proto__ || (0, _getPrototypeOf2.default)(EncodingError)).call(this));

        _this.type = 'EncodingError';
        _this.message = reason + ' (offset=' + offset + ').';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, start || EncodingError);
        }
        return _this;
    }

    return EncodingError;
}(Error);

exports.EncodingError = EncodingError;

var Varint = function Varint(size, value) {
    (0, _classCallCheck3.default)(this, Varint);

    this.size = size;
    this.value = value;
};

function assert(value, offset) {
    if (!value) {
        throw new EncodingError(offset, 'Out of bounds read', assert);
    }
}
function enforce(value, offset, reason) {
    if (!value) {
        throw new EncodingError(offset, reason, enforce);
    }
}