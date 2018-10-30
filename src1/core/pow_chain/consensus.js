"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getTarget = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(header, chain) {
        var prevRet, height, hr, retargetFrom, ghr, newTraget;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(header.number === 0)) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, target: chain.globalOptions.basicBits });

                    case 2:
                        _context.next = 4;
                        return chain.getHeader(header.preBlockHash);

                    case 4:
                        prevRet = _context.sent;

                        if (prevRet.header) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_BLOCK });

                    case 7:
                        if (!((header.number + 1) % chain.globalOptions.retargetInterval !== 0)) {
                            _context.next = 9;
                            break;
                        }

                        return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, target: prevRet.header.bits });

                    case 9:
                        // Back 2 weeks
                        height = header.number - (chain.globalOptions.retargetInterval - 1);

                        assert(height >= 0);
                        _context.next = 13;
                        return chain.getHeader(height);

                    case 13:
                        hr = _context.sent;
                        retargetFrom = void 0;

                        if (hr.err) {
                            _context.next = 20;
                            break;
                        }

                        assert(hr.header);
                        retargetFrom = hr.header;
                        _context.next = 31;
                        break;

                    case 20:
                        if (!(hr.err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                            _context.next = 30;
                            break;
                        }

                        _context.next = 23;
                        return chain.getHeader(header, -(chain.globalOptions.retargetInterval - 1));

                    case 23:
                        ghr = _context.sent;

                        if (!ghr.err) {
                            _context.next = 26;
                            break;
                        }

                        return _context.abrupt("return", { err: ghr.err });

                    case 26:
                        assert(ghr.header);
                        retargetFrom = ghr.header;
                        _context.next = 31;
                        break;

                    case 30:
                        return _context.abrupt("return", { err: hr.err });

                    case 31:
                        newTraget = retarget(prevRet.header.bits, prevRet.header.timestamp - retargetFrom.timestamp, chain);
                        return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, target: newTraget });

                    case 33:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getTarget(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var BN = require('bn.js');
var assert = require("assert");
var error_code_1 = require("../error_code");
exports.INT32_MAX = 0xffffffff;
// 我们测试时保证1分钟一块，每10块调整一次难度
// //每次重新计算难度的间隔块，BTC为2016, 
// export const retargetInterval = 10;
// //每个难度的理想持续时间，BTC为14 * 24 * 60 * 60, 单位和timestamp单位相同，seconds
// export const targetTimespan = 1 * 60;
// //初始bits,BTC为486604799， 对应的hash值为'00000000ffff0000000000000000000000000000000000000000000000000000'
// //我们设定为'0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
// export const basicBits = 520159231;
// //最小难度
// export const limit = new BN('0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'hex');
function onCheckGlobalOptions(globalOptions) {
    if (util_1.isNullOrUndefined(globalOptions.retargetInterval)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.targetTimespan)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.basicBits)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.limit)) {
        return false;
    }
    return true;
}
exports.onCheckGlobalOptions = onCheckGlobalOptions;
/**
 * Convert a compact number to a big number.
 * Used for `block.bits` -> `target` conversion.
 * @param {Number} compact
 * @returns {BN}
 */
function fromCompact(compact) {
    if (compact === 0) {
        return new BN(0);
    }
    var exponent = compact >>> 24;
    var negative = compact >>> 23 & 1;
    var mantissa = compact & 0x7fffff;
    var num = void 0;
    if (exponent <= 3) {
        mantissa >>>= 8 * (3 - exponent);
        num = new BN(mantissa);
    } else {
        num = new BN(mantissa);
        num.iushln(8 * (exponent - 3));
    }
    if (negative) {
        num.ineg();
    }
    return num;
}
exports.fromCompact = fromCompact;
/**
 * Convert a big number to a compact number.
 * Used for `target` -> `block.bits` conversion.
 * @param {BN} num
 * @returns {Number}
 */
function toCompact(num) {
    if (num.isZero()) {
        return 0;
    }
    var exponent = num.byteLength();
    var mantissa = void 0;
    if (exponent <= 3) {
        mantissa = num.toNumber();
        mantissa <<= 8 * (3 - exponent);
    } else {
        mantissa = num.ushrn(8 * (exponent - 3)).toNumber();
    }
    if (mantissa & 0x800000) {
        mantissa >>= 8;
        exponent++;
    }
    var compact = exponent << 24 | mantissa;
    if (num.isNeg()) {
        compact |= 0x800000;
    }
    compact >>>= 0;
    return compact;
}
exports.toCompact = toCompact;
/**
 * Verify proof-of-work.
 * @param {Hash} hash
 * @param {Number} bits
 * @returns {Boolean}
 */
function verifyPOW(hash, bits) {
    var target = fromCompact(bits);
    if (target.isNeg() || target.isZero()) {
        return false;
    }
    var targetHash = target.toBuffer('be', 32);
    return hash.compare(targetHash) < 1;
}
exports.verifyPOW = verifyPOW;
function retarget(prevbits, actualTimespan, chain) {
    var target = fromCompact(prevbits);
    if (actualTimespan < (chain.globalOptions.targetTimespan / 4 | 0)) {
        actualTimespan = chain.globalOptions.targetTimespan / 4 | 0;
    }
    if (actualTimespan > chain.globalOptions.targetTimespa * 4) {
        actualTimespan = chain.globalOptions.targetTimespan * 4;
    }
    target.imuln(actualTimespan);
    target.idivn(chain.globalOptions.targetTimespan);
    if (target.gt(new BN(chain.globalOptions.limit, 'hex'))) {
        return chain.globalOptions.basicBits;
    }
    return toCompact(target);
}
exports.retarget = retarget;

exports.getTarget = getTarget;