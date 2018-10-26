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
var error_code_1 = require("../error_code");
var address_1 = require("../address");
var chain_1 = require("../chain");
var context_1 = require("./context");
var chain_2 = require("./chain");
var util_1 = require("util");
var assert = require('assert');

var ValueBlockExecutor = function (_chain_1$BlockExecuto) {
    (0, _inherits3.default)(ValueBlockExecutor, _chain_1$BlockExecuto);

    function ValueBlockExecutor() {
        (0, _classCallCheck3.default)(this, ValueBlockExecutor);
        return (0, _possibleConstructorReturn3.default)(this, (ValueBlockExecutor.__proto__ || (0, _getPrototypeOf2.default)(ValueBlockExecutor)).apply(this, arguments));
    }

    (0, _createClass3.default)(ValueBlockExecutor, [{
        key: "_newTransactionExecutor",
        value: function _newTransactionExecutor(l, tx) {
            return new ValueTransactionExecutor(l, tx, this.m_logger);
        }
    }, {
        key: "executeMinerWageEvent",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var l, wage, kvBalance, ve, coinbase;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                l = this.m_handler.getMinerWageListener();
                                _context.next = 3;
                                return l(this.m_block.number);

                            case 3:
                                wage = _context.sent;
                                _context.next = 6;
                                return this.m_storage.getKeyValue(chain_1.Chain.dbSystem, chain_2.ValueChain.kvBalance);

                            case 6:
                                kvBalance = _context.sent.kv;
                                ve = new context_1.Context(kvBalance);
                                coinbase = this.m_block.header.coinbase;

                                assert(address_1.isValidAddress(coinbase), "block " + this.m_block.hash + " has no coinbase set");
                                if (!address_1.isValidAddress(coinbase)) {
                                    coinbase = chain_2.ValueChain.sysAddress;
                                }
                                _context.next = 13;
                                return ve.issue(coinbase, wage);

                            case 13:
                                return _context.abrupt("return", _context.sent);

                            case 14:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function executeMinerWageEvent() {
                return _ref.apply(this, arguments);
            }

            return executeMinerWageEvent;
        }()
    }, {
        key: "_executePreBlockEvent",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var err;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.executeMinerWageEvent();

                            case 2:
                                err = _context2.sent;

                                if (!err) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt("return", err);

                            case 5:
                                _context2.next = 7;
                                return (0, _get3.default)(ValueBlockExecutor.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueBlockExecutor.prototype), "_executePreBlockEvent", this).call(this);

                            case 7:
                                return _context2.abrupt("return", _context2.sent);

                            case 8:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _executePreBlockEvent() {
                return _ref2.apply(this, arguments);
            }

            return _executePreBlockEvent;
        }()
    }]);
    return ValueBlockExecutor;
}(chain_1.BlockExecutor);

exports.ValueBlockExecutor = ValueBlockExecutor;

var ValueTransactionExecutor = function (_chain_1$TransactionE) {
    (0, _inherits3.default)(ValueTransactionExecutor, _chain_1$TransactionE);

    function ValueTransactionExecutor(listener, tx, logger) {
        (0, _classCallCheck3.default)(this, ValueTransactionExecutor);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (ValueTransactionExecutor.__proto__ || (0, _getPrototypeOf2.default)(ValueTransactionExecutor)).call(this, listener, tx, logger));

        _this2.m_toAddress = '';
        return _this2;
    }

    (0, _createClass3.default)(ValueTransactionExecutor, [{
        key: "prepareContext",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(blockHeader, storage, externContext) {
                var context;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return (0, _get3.default)(ValueTransactionExecutor.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueTransactionExecutor.prototype), "prepareContext", this).call(this, blockHeader, storage, externContext);

                            case 2:
                                context = _context3.sent;

                                Object.defineProperty(context, 'value', {
                                    writable: false,
                                    value: this.m_tx.value
                                });
                                return _context3.abrupt("return", context);

                            case 5:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function prepareContext(_x, _x2, _x3) {
                return _ref3.apply(this, arguments);
            }

            return prepareContext;
        }()
    }, {
        key: "execute",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(blockHeader, storage, externContext, flag) {
                var nonceErr, kvBalance, fromAddress, nToValue, nFee, receipt, ve, context, work, err, coinbase;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (flag && flag.ignoreNoce) {
                                    _context4.next = 6;
                                    break;
                                }

                                _context4.next = 3;
                                return this._dealNonce(this.m_tx, storage);

                            case 3:
                                nonceErr = _context4.sent;

                                if (!(nonceErr !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context4.next = 6;
                                    break;
                                }

                                return _context4.abrupt("return", { err: nonceErr });

                            case 6:
                                _context4.next = 8;
                                return storage.getKeyValue(chain_1.Chain.dbSystem, chain_2.ValueChain.kvBalance);

                            case 8:
                                kvBalance = _context4.sent.kv;
                                fromAddress = this.m_tx.address;
                                nToValue = this.m_tx.value;
                                nFee = this.m_tx.fee;
                                receipt = new chain_1.Receipt();
                                ve = new context_1.Context(kvBalance);
                                _context4.next = 16;
                                return ve.getBalance(fromAddress);

                            case 16:
                                _context4.t0 = nToValue.plus(nFee);

                                if (!_context4.sent.lt(_context4.t0)) {
                                    _context4.next = 21;
                                    break;
                                }

                                receipt.returnCode = error_code_1.ErrorCode.RESULT_NOT_ENOUGH;
                                receipt.transactionHash = this.m_tx.hash;
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, receipt: receipt });

                            case 21:
                                _context4.next = 23;
                                return this.prepareContext(blockHeader, storage, externContext);

                            case 23:
                                context = _context4.sent;
                                _context4.next = 26;
                                return storage.beginTransaction();

                            case 26:
                                work = _context4.sent;

                                if (!work.err) {
                                    _context4.next = 29;
                                    break;
                                }

                                return _context4.abrupt("return", { err: work.err });

                            case 29:
                                _context4.next = 31;
                                return ve.transferTo(fromAddress, chain_2.ValueChain.sysAddress, nToValue);

                            case 31:
                                err = _context4.sent;

                                if (!err) {
                                    _context4.next = 36;
                                    break;
                                }

                                _context4.next = 35;
                                return work.value.rollback();

                            case 35:
                                return _context4.abrupt("return", { err: err });

                            case 36:
                                _context4.next = 38;
                                return this._execute(context, this.m_tx.input);

                            case 38:
                                receipt.returnCode = _context4.sent;

                                assert(util_1.isNumber(receipt.returnCode), "invalid handler return code " + receipt.returnCode);

                                if (util_1.isNumber(receipt.returnCode)) {
                                    _context4.next = 43;
                                    break;
                                }

                                this.m_logger.error("methodexecutor failed for invalid handler return code type, return=", receipt.returnCode);
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM });

                            case 43:
                                receipt.transactionHash = this.m_tx.hash;

                                if (!receipt.returnCode) {
                                    _context4.next = 49;
                                    break;
                                }

                                _context4.next = 47;
                                return work.value.rollback();

                            case 47:
                                _context4.next = 53;
                                break;

                            case 49:
                                receipt.eventLogs = this.m_logs;
                                _context4.next = 52;
                                return work.value.commit();

                            case 52:
                                err = _context4.sent;

                            case 53:
                                coinbase = blockHeader.coinbase;

                                assert(address_1.isValidAddress(coinbase), "block " + blockHeader.hash + " has no coinbase set");
                                if (!address_1.isValidAddress(coinbase)) {
                                    coinbase = chain_2.ValueChain.sysAddress;
                                }
                                _context4.next = 58;
                                return ve.transferTo(fromAddress, coinbase, nFee);

                            case 58:
                                err = _context4.sent;

                                if (!err) {
                                    _context4.next = 61;
                                    break;
                                }

                                return _context4.abrupt("return", { err: err });

                            case 61:
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, receipt: receipt });

                            case 62:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function execute(_x4, _x5, _x6, _x7) {
                return _ref4.apply(this, arguments);
            }

            return execute;
        }()
    }]);
    return ValueTransactionExecutor;
}(chain_1.TransactionExecutor);

exports.ValueTransactionExecutor = ValueTransactionExecutor;