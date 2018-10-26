"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var writer_1 = require("../lib/writer");
var error_code_1 = require("../error_code");
var value_chain_1 = require("../value_chain");
var consensus = require("./consensus");
var assert = require("assert");
var digest = require("../lib/digest");
// type Constructor<T> = new () => T;
// export function blockHeaderClass<T extends BaseBlock.BlockHeader>(superBlockHeader: Constructor<T>) {
//     class BlockHeaderClass extends (superBlockHeader as Constructor<BaseBlock.BlockHeader>) {

var PowBlockHeader = function (_value_chain_1$ValueB) {
    (0, _inherits3.default)(PowBlockHeader, _value_chain_1$ValueB);

    function PowBlockHeader() {
        (0, _classCallCheck3.default)(this, PowBlockHeader);

        var _this = (0, _possibleConstructorReturn3.default)(this, (PowBlockHeader.__proto__ || (0, _getPrototypeOf2.default)(PowBlockHeader)).call(this));

        _this.m_bits = 0;
        _this.m_nonce = 0;
        _this.m_nonce1 = 0;
        // this.m_bits = POWUtil.getTarget(prevheader);
        return _this;
    }

    (0, _createClass3.default)(PowBlockHeader, [{
        key: "_encodeHashContent",
        value: function _encodeHashContent(writer) {
            var err = (0, _get3.default)(PowBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowBlockHeader.prototype), "_encodeHashContent", this).call(this, writer);
            if (err) {
                return err;
            }
            try {
                writer.writeU32(this.m_bits);
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "encode",
        value: function encode(writer) {
            var err = (0, _get3.default)(PowBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowBlockHeader.prototype), "encode", this).call(this, writer);
            if (err) {
                return err;
            }
            try {
                writer.writeU32(this.m_nonce);
                writer.writeU32(this.m_nonce1);
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_decodeHashContent",
        value: function _decodeHashContent(reader) {
            var err = (0, _get3.default)(PowBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowBlockHeader.prototype), "_decodeHashContent", this).call(this, reader);
            if (err !== error_code_1.ErrorCode.RESULT_OK) {
                return err;
            }
            try {
                this.m_bits = reader.readU32();
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            var err = (0, _get3.default)(PowBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowBlockHeader.prototype), "decode", this).call(this, reader);
            if (err !== error_code_1.ErrorCode.RESULT_OK) {
                return err;
            }
            try {
                this.m_nonce = reader.readU32();
                this.m_nonce1 = reader.readU32();
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "verify",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(chain) {
                var vr, _ref2, err, target;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _get3.default)(PowBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowBlockHeader.prototype), "verify", this).call(this, chain);

                            case 2:
                                vr = _context.sent;

                                if (!(vr.err || !vr.valid)) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return", vr);

                            case 5:
                                _context.next = 7;
                                return consensus.getTarget(this, chain);

                            case 7:
                                _ref2 = _context.sent;
                                err = _ref2.err;
                                target = _ref2.target;

                                if (!err) {
                                    _context.next = 12;
                                    break;
                                }

                                return _context.abrupt("return", { err: err });

                            case 12:
                                if (!(this.m_bits !== target)) {
                                    _context.next = 14;
                                    break;
                                }

                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, valid: false });

                            case 14:
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, valid: this.verifyPOW() });

                            case 15:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function verify(_x) {
                return _ref.apply(this, arguments);
            }

            return verify;
        }()
    }, {
        key: "verifyPOW",
        value: function verifyPOW() {
            var writer = new writer_1.BufferWriter();
            if (this.encode(writer)) {
                return false;
            }
            var content = writer.render();
            return consensus.verifyPOW(digest.hash256(content), this.m_bits);
        }
    }, {
        key: "stringify",
        value: function stringify() {
            var obj = (0, _get3.default)(PowBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowBlockHeader.prototype), "stringify", this).call(this);
            obj.difficulty = this.bits;
            return obj;
        }
    }, {
        key: "bits",
        get: function get() {
            return this.m_bits;
        },
        set: function set(bits) {
            this.m_bits = bits;
        }
    }, {
        key: "nonce",
        get: function get() {
            return this.m_nonce;
        },
        set: function set(_nonce) {
            assert(_nonce <= consensus.INT32_MAX);
            this.m_nonce = _nonce;
        }
    }, {
        key: "nonce1",
        get: function get() {
            return this.m_nonce1;
        },
        set: function set(nonce) {
            assert(nonce <= consensus.INT32_MAX);
            this.m_nonce1 = nonce;
        }
    }]);
    return PowBlockHeader;
}(value_chain_1.ValueBlockHeader);

exports.PowBlockHeader = PowBlockHeader;
//     return BlockHeaderClass as Constructor<T & BlockHeaderClass>;
// }