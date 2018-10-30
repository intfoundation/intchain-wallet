"use strict";

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

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
var error_code_1 = require("../error_code");
var value_chain_1 = require("../value_chain");
var libAddress = require("../address");
var context_1 = require("./context");

var DbftBlockHeader = function (_value_chain_1$BlockW) {
    (0, _inherits3.default)(DbftBlockHeader, _value_chain_1$BlockW);

    function DbftBlockHeader() {
        (0, _classCallCheck3.default)(this, DbftBlockHeader);

        // 签名部分不进入hash计算
        var _this = (0, _possibleConstructorReturn3.default)(this, (DbftBlockHeader.__proto__ || (0, _getPrototypeOf2.default)(DbftBlockHeader)).apply(this, arguments));

        _this.m_dbftSigns = [];
        _this.m_view = 0;
        return _this;
    }

    (0, _createClass3.default)(DbftBlockHeader, [{
        key: "_encodeHashContent",
        value: function _encodeHashContent(writer) {
            var err = (0, _get3.default)(DbftBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftBlockHeader.prototype), "_encodeHashContent", this).call(this, writer);
            if (err) {
                return err;
            }
            try {
                writer.writeU32(this.m_view);
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_PARAM;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_decodeHashContent",
        value: function _decodeHashContent(reader) {
            var err = (0, _get3.default)(DbftBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftBlockHeader.prototype), "_decodeHashContent", this).call(this, reader);
            if (err) {
                return err;
            }
            try {
                reader.readU32();
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_EXCEPTION;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "encode",
        value: function encode(writer) {
            var err = (0, _get3.default)(DbftBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftBlockHeader.prototype), "encode", this).call(this, writer);
            if (err) {
                return err;
            }
            writer.writeU16(this.m_dbftSigns.length);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.m_dbftSigns), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var s = _step.value;

                    writer.writeBytes(s.pubkey);
                    writer.writeBytes(s.sign);
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

            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            var err = (0, _get3.default)(DbftBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftBlockHeader.prototype), "decode", this).call(this, reader);
            if (err) {
                return err;
            }
            try {
                var n = reader.readU16();
                for (var i = 0; i < n; i++) {
                    var pubkey = reader.readBytes(33);
                    var sign = reader.readBytes(64);
                    this.m_dbftSigns.push({ pubkey: pubkey, sign: sign });
                }
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "setSigns",
        value: function setSigns(signs) {
            var _m_dbftSigns;

            this.m_dbftSigns = [];
            (_m_dbftSigns = this.m_dbftSigns).push.apply(_m_dbftSigns, (0, _toConsumableArray3.default)(signs));
        }
    }, {
        key: "verifySign",
        value: function verifySign() {
            return this._verifySign();
        }
    }, {
        key: "verify",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(chain) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (this._verifySign()) {
                                    _context.next = 3;
                                    break;
                                }

                                chain.logger.error("verify block " + this.number + " sign error!");
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, valid: false });

                            case 3:
                                _context.next = 5;
                                return this._verifySigns(chain);

                            case 5:
                                return _context.abrupt("return", _context.sent);

                            case 6:
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
        key: "_verifySigns",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(chain) {
                var gm, gdr, miners, verified, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, s, address, valid;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return chain.dbftHeaderStorage.getMiners(this);

                            case 2:
                                gm = _context2.sent;

                                if (!gm.err) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt("return", { err: gm.err });

                            case 5:
                                _context2.next = 7;
                                return chain.dbftHeaderStorage.getDueMiner(this, gm.miners);

                            case 7:
                                gdr = _context2.sent;

                                if (!gdr.err) {
                                    _context2.next = 10;
                                    break;
                                }

                                return _context2.abrupt("return", { err: gdr.err });

                            case 10:
                                if (!(this.miner !== gdr.miner)) {
                                    _context2.next = 12;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, valid: false });

                            case 12:
                                miners = new _set2.default(gm.miners);
                                verified = new _set2.default();
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context2.prev = 17;

                                for (_iterator2 = (0, _getIterator3.default)(this.m_dbftSigns); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    s = _step2.value;
                                    address = libAddress.addressFromPublicKey(s.pubkey);

                                    if (miners.has(address) && !verified.has(address)) {
                                        if (libAddress.verify(this.hash, s.sign, s.pubkey)) {
                                            verified.add(address);
                                        }
                                    }
                                }
                                _context2.next = 25;
                                break;

                            case 21:
                                _context2.prev = 21;
                                _context2.t0 = _context2["catch"](17);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context2.t0;

                            case 25:
                                _context2.prev = 25;
                                _context2.prev = 26;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 28:
                                _context2.prev = 28;

                                if (!_didIteratorError2) {
                                    _context2.next = 31;
                                    break;
                                }

                                throw _iteratorError2;

                            case 31:
                                return _context2.finish(28);

                            case 32:
                                return _context2.finish(25);

                            case 33:
                                valid = context_1.DbftContext.isAgreeRateReached(chain.globalOptions, miners.size, verified.size);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, valid: valid });

                            case 35:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[17, 21, 25, 33], [26,, 28, 32]]);
            }));

            function _verifySigns(_x2) {
                return _ref2.apply(this, arguments);
            }

            return _verifySigns;
        }()
    }, {
        key: "view",
        set: function set(v) {
            this.m_view = v;
        },
        get: function get() {
            return this.m_view;
        }
    }]);
    return DbftBlockHeader;
}(value_chain_1.BlockWithSign(value_chain_1.ValueBlockHeader));

exports.DbftBlockHeader = DbftBlockHeader;