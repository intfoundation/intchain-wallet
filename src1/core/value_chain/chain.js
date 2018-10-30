"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

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
var bignumber_js_1 = require("bignumber.js");
var error_code_1 = require("../error_code");
var assert = require('assert');
var address_1 = require("../address");
var chain_1 = require("../chain");
var block_1 = require("./block");
var transaction_1 = require("./transaction");
var executor_1 = require("./executor");
var ValueContext = require("./context");
var pending_1 = require("./pending");

var ValueChain = function (_chain_1$Chain) {
    (0, _inherits3.default)(ValueChain, _chain_1$Chain);

    function ValueChain(options) {
        (0, _classCallCheck3.default)(this, ValueChain);
        return (0, _possibleConstructorReturn3.default)(this, (ValueChain.__proto__ || (0, _getPrototypeOf2.default)(ValueChain)).call(this, options));
    }

    (0, _createClass3.default)(ValueChain, [{
        key: "newBlockExecutor",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(block, storage) {
                var kvBalance, ve, externContext, executor;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return storage.getKeyValue(chain_1.Chain.dbSystem, ValueChain.kvBalance);

                            case 2:
                                kvBalance = _context.sent.kv;
                                ve = new ValueContext.Context(kvBalance);
                                externContext = (0, _create2.default)(null);

                                externContext.getBalance = function (address) {
                                    return ve.getBalance(address);
                                };
                                externContext.transferTo = function (address, amount) {
                                    return ve.transferTo(ValueChain.sysAddress, address, amount);
                                };
                                executor = new executor_1.ValueBlockExecutor({ logger: this.logger, block: block, storage: storage, handler: this.handler, externContext: externContext, globalOptions: this.m_globalOptions });
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, executor: executor });

                            case 9:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function newBlockExecutor(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return newBlockExecutor;
        }()
    }, {
        key: "newViewExecutor",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(header, storage, method, param) {
                var dbSystem, kvBalance, ve, externContext, executor;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return storage.getReadableDataBase(chain_1.Chain.dbSystem);

                            case 2:
                                dbSystem = _context2.sent.value;
                                _context2.next = 5;
                                return dbSystem.getReadableKeyValue(ValueChain.kvBalance);

                            case 5:
                                kvBalance = _context2.sent.kv;
                                ve = new ValueContext.ViewContext(kvBalance);
                                externContext = (0, _create2.default)(null);

                                externContext.getBalance = function (address) {
                                    return ve.getBalance(address);
                                };
                                executor = new chain_1.ViewExecutor({ logger: this.logger, header: header, storage: storage, method: method, param: param, handler: this.handler, externContext: externContext });
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, executor: executor });

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function newViewExecutor(_x3, _x4, _x5, _x6) {
                return _ref2.apply(this, arguments);
            }

            return newViewExecutor;
        }()
    }, {
        key: "_getBlockHeaderType",
        value: function _getBlockHeaderType() {
            return block_1.ValueBlockHeader;
        }
    }, {
        key: "_getTransactionType",
        value: function _getTransactionType() {
            return transaction_1.ValueTransaction;
        }
    }, {
        key: "_createPending",
        value: function _createPending() {
            return new pending_1.ValuePendingTransactions({ storageManager: this.m_storageManager, logger: this.logger, txlivetime: this.m_globalOptions.txlivetime });
        }
    }, {
        key: "onCreateGenesisBlock",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(block, storage, genesisOptions) {
                var err, dbr, dbSystem, gkvr, rpr, kvr, kvBalance, index;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return (0, _get3.default)(ValueChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueChain.prototype), "onCreateGenesisBlock", this).call(this, block, storage, genesisOptions);

                            case 2:
                                err = _context3.sent;

                                if (!err) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt("return", err);

                            case 5:
                                _context3.next = 7;
                                return storage.getReadWritableDatabase(chain_1.Chain.dbSystem);

                            case 7:
                                dbr = _context3.sent;

                                if (!dbr.err) {
                                    _context3.next = 11;
                                    break;
                                }

                                assert(false, "value chain create genesis failed for no system database");
                                return _context3.abrupt("return", dbr.err);

                            case 11:
                                dbSystem = dbr.value;
                                _context3.next = 14;
                                return dbSystem.getReadWritableKeyValue(chain_1.Chain.kvConfig);

                            case 14:
                                gkvr = _context3.sent;

                                if (!gkvr.err) {
                                    _context3.next = 17;
                                    break;
                                }

                                return _context3.abrupt("return", gkvr.err);

                            case 17:
                                _context3.next = 19;
                                return gkvr.kv.rpush('features', 'value');

                            case 19:
                                rpr = _context3.sent;

                                if (!rpr.err) {
                                    _context3.next = 22;
                                    break;
                                }

                                return _context3.abrupt("return", rpr.err);

                            case 22:
                                if (!(!genesisOptions || !address_1.isValidAddress(genesisOptions.coinbase))) {
                                    _context3.next = 25;
                                    break;
                                }

                                this.m_logger.error("create genesis failed for genesisOptioins should has valid coinbase");
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_PARAM);

                            case 25:
                                block.header.coinbase = genesisOptions.coinbase;
                                _context3.next = 28;
                                return dbSystem.createKeyValue(ValueChain.kvBalance);

                            case 28:
                                kvr = _context3.sent;

                                if (!(genesisOptions && genesisOptions.preBalances)) {
                                    _context3.next = 38;
                                    break;
                                }

                                // 这里要给几个账户放钱
                                kvBalance = kvr.kv;
                                index = 0;

                            case 32:
                                if (!(index < genesisOptions.preBalances.length)) {
                                    _context3.next = 38;
                                    break;
                                }

                                _context3.next = 35;
                                return kvBalance.set(genesisOptions.preBalances[index].address, new bignumber_js_1.BigNumber(genesisOptions.preBalances[index].amount));

                            case 35:
                                index++;
                                _context3.next = 32;
                                break;

                            case 38:
                                return _context3.abrupt("return", kvr.err);

                            case 39:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function onCreateGenesisBlock(_x7, _x8, _x9) {
                return _ref3.apply(this, arguments);
            }

            return onCreateGenesisBlock;
        }()
    }]);
    return ValueChain;
}(chain_1.Chain);
// 存储每个address的money，其中有一个默认的系统账户


ValueChain.kvBalance = 'balance'; // address<--->blance
ValueChain.sysAddress = '0';
exports.ValueChain = ValueChain;