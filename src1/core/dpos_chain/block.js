"use strict";

var _trunc = require("babel-runtime/core-js/math/trunc");

var _trunc2 = _interopRequireDefault(_trunc);

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

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var error_code_1 = require("../error_code");
var value_chain_1 = require("../value_chain");
//  出块计算从1开始，假设重新选举周期为100：
//  第一周期为1-100 
// 第二周期为101-200
// 以此类推

var DposBlockHeader = function (_value_chain_1$BlockW) {
    (0, _inherits3.default)(DposBlockHeader, _value_chain_1$BlockW);

    function DposBlockHeader() {
        (0, _classCallCheck3.default)(this, DposBlockHeader);
        return (0, _possibleConstructorReturn3.default)(this, (DposBlockHeader.__proto__ || (0, _getPrototypeOf2.default)(DposBlockHeader)).apply(this, arguments));
    }

    (0, _createClass3.default)(DposBlockHeader, [{
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
                                return this._verifyMiner(chain);

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
        key: "getTimeIndex",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(chain) {
                var hr, offset, src, min, max;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return chain.getHeader(0);

                            case 2:
                                hr = _context2.sent;

                                if (!hr.err) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt("return", { err: hr.err });

                            case 5:
                                // TODO: 可以兼容一些误差?
                                offset = this.timestamp - hr.header.timestamp;

                                if (!(offset < 0)) {
                                    _context2.next = 9;
                                    break;
                                }

                                chain.logger.error("error offset " + offset + ", timestamp " + this.timestamp + ", genesis " + hr.header.timestamp);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 9:
                                // 不能偏离太远
                                src = (0, _trunc2.default)(offset / chain.globalOptions.blockInterval);
                                min = (0, _trunc2.default)((offset - chain.globalOptions.maxBlockIntervalOffset) / chain.globalOptions.blockInterval);
                                max = (0, _trunc2.default)((offset + chain.globalOptions.maxBlockIntervalOffset) / chain.globalOptions.blockInterval);

                                if (!(src === min && src === max)) {
                                    _context2.next = 16;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, index: src });

                            case 16:
                                if (!(src !== min)) {
                                    _context2.next = 20;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, index: src });

                            case 20:
                                if (!(src !== max)) {
                                    _context2.next = 24;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, index: max });

                            case 24:
                                assert(false);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 26:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getTimeIndex(_x2) {
                return _ref2.apply(this, arguments);
            }

            return getTimeIndex;
        }()
    }, {
        key: "_verifyMiner",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(chain) {
                var hr, preHeader, dmr;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (this.number) {
                                    _context3.next = 2;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 2:
                                _context3.next = 4;
                                return chain.getHeader(this.preBlockHash);

                            case 4:
                                hr = _context3.sent;

                                if (!hr.err) {
                                    _context3.next = 7;
                                    break;
                                }

                                return _context3.abrupt("return", { err: hr.err });

                            case 7:
                                // 时间不可回退
                                preHeader = hr.header;

                                if (!(this.timestamp < preHeader.timestamp)) {
                                    _context3.next = 10;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, valid: false });

                            case 10:
                                _context3.next = 12;
                                return this.getDueMiner(chain);

                            case 12:
                                dmr = _context3.sent;

                                if (!dmr.err) {
                                    _context3.next = 15;
                                    break;
                                }

                                return _context3.abrupt("return", { err: dmr.err });

                            case 15:
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, valid: dmr.miner === this.miner });

                            case 16:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _verifyMiner(_x3) {
                return _ref3.apply(this, arguments);
            }

            return _verifyMiner;
        }()
    }, {
        key: "getDueMiner",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(chain) {
                var tir, thisIndex, gcr, electionHeader, electionIndex, index, creators;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (this.number) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 2:
                                _context4.next = 4;
                                return this.getTimeIndex(chain);

                            case 4:
                                tir = _context4.sent;

                                if (!tir.err) {
                                    _context4.next = 8;
                                    break;
                                }

                                chain.logger.error("getTimeIndex failed, err " + tir.err);
                                return _context4.abrupt("return", { err: tir.err });

                            case 8:
                                if (tir.index) {
                                    _context4.next = 11;
                                    break;
                                }

                                chain.logger.error("getTimeIndex failed, no tir.index");
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 11:
                                thisIndex = tir.index;
                                _context4.next = 14;
                                return chain.getMiners(this);

                            case 14:
                                gcr = _context4.sent;

                                if (!gcr.err) {
                                    _context4.next = 18;
                                    break;
                                }

                                chain.logger.error("getMiners failed, err " + gcr.err);
                                return _context4.abrupt("return", { err: gcr.err });

                            case 18:
                                electionHeader = gcr.header;
                                _context4.next = 21;
                                return electionHeader.getTimeIndex(chain);

                            case 21:
                                tir = _context4.sent;
                                electionIndex = tir.index;
                                index = (thisIndex - electionIndex) % gcr.creators.length;

                                if (!(index < 0)) {
                                    _context4.next = 27;
                                    break;
                                }

                                chain.logger.error("calcute index failed, thisIndex " + thisIndex + ", electionIndex " + electionIndex + ", creators length " + gcr.creators.length);
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 27:
                                creators = gcr.creators;
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, miner: creators[index] });

                            case 29:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getDueMiner(_x4) {
                return _ref4.apply(this, arguments);
            }

            return getDueMiner;
        }()
    }]);
    return DposBlockHeader;
}(value_chain_1.BlockWithSign(value_chain_1.ValueBlockHeader));

exports.DposBlockHeader = DposBlockHeader;