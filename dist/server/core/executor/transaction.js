"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var assert = require('assert');
var error_code_1 = require("../error_code");
var chain_1 = require("../chain");
var util_1 = require("util");

var _require = require('../lib/log_shim'),
    LogShim = _require.LogShim;

var BaseExecutor = function () {
    function BaseExecutor(logger) {
        (0, _classCallCheck3.default)(this, BaseExecutor);

        this.m_logger = logger;
    }

    (0, _createClass3.default)(BaseExecutor, [{
        key: "prepareContext",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(blockHeader, storage, externContext) {
                var database, context;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return storage.getReadWritableDatabase(chain_1.Chain.dbUser);

                            case 2:
                                database = _context.sent.value;
                                context = (0, _create2.default)(externContext);
                                // context.getNow = (): number => {
                                //     return blockHeader.timestamp;
                                // };

                                Object.defineProperty(context, 'now', {
                                    writable: false,
                                    value: blockHeader.timestamp
                                });
                                // context.getHeight = (): number => {
                                //     return blockHeader.number;
                                // };
                                Object.defineProperty(context, 'height', {
                                    writable: false,
                                    value: blockHeader.number
                                });
                                // context.getStorage = (): IReadWritableKeyValue => {
                                //     return kv;
                                // }
                                Object.defineProperty(context, 'storage', {
                                    writable: false,
                                    value: database
                                });
                                return _context.abrupt("return", context);

                            case 8:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function prepareContext(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return prepareContext;
        }()
    }]);
    return BaseExecutor;
}();

var TransactionExecutor = function (_BaseExecutor) {
    (0, _inherits3.default)(TransactionExecutor, _BaseExecutor);

    function TransactionExecutor(listener, tx, logger) {
        (0, _classCallCheck3.default)(this, TransactionExecutor);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TransactionExecutor.__proto__ || (0, _getPrototypeOf2.default)(TransactionExecutor)).call(this, new LogShim(logger).bind("[transaction: " + tx.hash + "]", true).log));

        _this.m_logs = [];
        _this.m_listener = listener;
        _this.m_tx = tx;
        return _this;
    }

    (0, _createClass3.default)(TransactionExecutor, [{
        key: "_dealNonce",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(tx, storage) {
                var kvr, nonce, nonceInfo;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return storage.getKeyValue(chain_1.Chain.dbSystem, chain_1.Chain.kvNonce);

                            case 2:
                                kvr = _context2.sent;

                                if (!(kvr.err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context2.next = 6;
                                    break;
                                }

                                this.m_logger.error("methodexecutor, _dealNonce, getReadWritableKeyValue failed");
                                return _context2.abrupt("return", kvr.err);

                            case 6:
                                nonce = -1;
                                _context2.next = 9;
                                return kvr.kv.get(tx.address);

                            case 9:
                                nonceInfo = _context2.sent;

                                if (nonceInfo.err === error_code_1.ErrorCode.RESULT_OK) {
                                    nonce = nonceInfo.value;
                                }

                                if (!(tx.nonce !== nonce + 1)) {
                                    _context2.next = 14;
                                    break;
                                }

                                this.m_logger.error("methodexecutor, _dealNonce, nonce error,nonce should " + (nonce + 1) + ", but " + tx.nonce + ", txhash=" + tx.hash);
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_ERROR_NONCE_IN_TX);

                            case 14:
                                _context2.next = 16;
                                return kvr.kv.set(tx.address, tx.nonce);

                            case 16:
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 17:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _dealNonce(_x4, _x5) {
                return _ref2.apply(this, arguments);
            }

            return _dealNonce;
        }()
    }, {
        key: "execute",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(blockHeader, storage, externContext, flag) {
                var nonceErr, context, receipt, work, err;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (flag && flag.ignoreNoce) {
                                    _context3.next = 6;
                                    break;
                                }

                                _context3.next = 3;
                                return this._dealNonce(this.m_tx, storage);

                            case 3:
                                nonceErr = _context3.sent;

                                if (!(nonceErr !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context3.next = 6;
                                    break;
                                }

                                return _context3.abrupt("return", { err: nonceErr });

                            case 6:
                                _context3.next = 8;
                                return this.prepareContext(blockHeader, storage, externContext);

                            case 8:
                                context = _context3.sent;
                                receipt = new chain_1.Receipt();
                                _context3.next = 12;
                                return storage.beginTransaction();

                            case 12:
                                work = _context3.sent;

                                if (!work.err) {
                                    _context3.next = 16;
                                    break;
                                }

                                this.m_logger.error("methodexecutor, beginTransaction error,storagefile=" + storage.filePath);
                                return _context3.abrupt("return", { err: work.err });

                            case 16:
                                _context3.next = 18;
                                return this._execute(context, this.m_tx.input);

                            case 18:
                                receipt.returnCode = _context3.sent;

                                assert(util_1.isNumber(receipt.returnCode), "invalid handler return code " + receipt.returnCode);

                                if (util_1.isNumber(receipt.returnCode)) {
                                    _context3.next = 23;
                                    break;
                                }

                                this.m_logger.error("methodexecutor failed for invalid handler return code type, return=", receipt.returnCode);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM });

                            case 23:
                                receipt.transactionHash = this.m_tx.hash;

                                if (!receipt.returnCode) {
                                    _context3.next = 30;
                                    break;
                                }

                                this.m_logger.warn("handler return code=" + receipt.returnCode + ", will rollback storage");
                                _context3.next = 28;
                                return work.value.rollback();

                            case 28:
                                _context3.next = 38;
                                break;

                            case 30:
                                this.m_logger.debug("handler return code " + receipt.returnCode + ", will commit storage");
                                _context3.next = 33;
                                return work.value.commit();

                            case 33:
                                err = _context3.sent;

                                if (!err) {
                                    _context3.next = 37;
                                    break;
                                }

                                this.m_logger.error("methodexecutor, transaction commit error, err=" + err + ", storagefile=" + storage.filePath);
                                return _context3.abrupt("return", { err: err });

                            case 37:
                                receipt.eventLogs = this.m_logs;

                            case 38:
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, receipt: receipt });

                            case 39:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function execute(_x6, _x7, _x8, _x9) {
                return _ref3.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: "_execute",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(env, input) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;

                                this.m_logger.info("will execute tx " + this.m_tx.hash + ": " + this.m_tx.method + ", params " + (0, _stringify2.default)(this.m_tx.input));
                                _context4.next = 4;
                                return this.m_listener(env, this.m_tx.input);

                            case 4:
                                return _context4.abrupt("return", _context4.sent);

                            case 7:
                                _context4.prev = 7;
                                _context4.t0 = _context4["catch"](0);

                                this.m_logger.error("execute method linstener e=", _context4.t0.stack);
                                return _context4.abrupt("return", error_code_1.ErrorCode.RESULT_EXECUTE_ERROR);

                            case 11:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 7]]);
            }));

            function _execute(_x10, _x11) {
                return _ref4.apply(this, arguments);
            }

            return _execute;
        }()
    }, {
        key: "prepareContext",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(blockHeader, storage, externContext) {
                var _this2 = this;

                var context;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return (0, _get3.default)(TransactionExecutor.prototype.__proto__ || (0, _getPrototypeOf2.default)(TransactionExecutor.prototype), "prepareContext", this).call(this, blockHeader, storage, externContext);

                            case 2:
                                context = _context5.sent;

                                // 执行上下文
                                context.emit = function (name, param) {
                                    var log = new chain_1.EventLog();
                                    log.name = name;
                                    log.param = param;
                                    _this2.m_logs.push(log);
                                };
                                // context.getCaller = ():string =>{
                                //     return this.m_tx.address!;
                                // };
                                Object.defineProperty(context, 'caller', {
                                    writable: false,
                                    value: this.m_tx.address
                                });
                                return _context5.abrupt("return", context);

                            case 6:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function prepareContext(_x12, _x13, _x14) {
                return _ref5.apply(this, arguments);
            }

            return prepareContext;
        }()
    }]);
    return TransactionExecutor;
}(BaseExecutor);

exports.TransactionExecutor = TransactionExecutor;

var EventExecutor = function (_BaseExecutor2) {
    (0, _inherits3.default)(EventExecutor, _BaseExecutor2);

    function EventExecutor(listener, logger) {
        (0, _classCallCheck3.default)(this, EventExecutor);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (EventExecutor.__proto__ || (0, _getPrototypeOf2.default)(EventExecutor)).call(this, logger));

        _this3.m_bBeforeBlockExec = true;
        _this3.m_listener = listener;
        return _this3;
    }

    (0, _createClass3.default)(EventExecutor, [{
        key: "execute",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(blockHeader, storage, externalContext) {
                var context, work, returnCode, err;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                this.m_logger.debug("execute event on " + blockHeader.number);
                                _context6.next = 3;
                                return this.prepareContext(blockHeader, storage, externalContext);

                            case 3:
                                context = _context6.sent;
                                _context6.next = 6;
                                return storage.beginTransaction();

                            case 6:
                                work = _context6.sent;

                                if (!work.err) {
                                    _context6.next = 10;
                                    break;
                                }

                                this.m_logger.error("eventexecutor, beginTransaction error,storagefile=" + storage.filePath);
                                return _context6.abrupt("return", { err: work.err });

                            case 10:
                                returnCode = void 0;
                                _context6.prev = 11;
                                _context6.next = 14;
                                return this.m_listener(context);

                            case 14:
                                returnCode = _context6.sent;
                                _context6.next = 21;
                                break;

                            case 17:
                                _context6.prev = 17;
                                _context6.t0 = _context6["catch"](11);

                                this.m_logger.error("execute event linstener error, e=", _context6.t0);
                                returnCode = error_code_1.ErrorCode.RESULT_EXCEPTION;

                            case 21:
                                assert(util_1.isNumber(returnCode), "event handler return code invalid " + returnCode);

                                if (util_1.isNumber(returnCode)) {
                                    _context6.next = 25;
                                    break;
                                }

                                this.m_logger.error("execute event failed for invalid return code");
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM });

                            case 25:
                                if (!(returnCode === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context6.next = 35;
                                    break;
                                }

                                this.m_logger.debug("event handler commit storage");
                                _context6.next = 29;
                                return work.value.commit();

                            case 29:
                                err = _context6.sent;

                                if (!err) {
                                    _context6.next = 33;
                                    break;
                                }

                                this.m_logger.error("eventexecutor, transaction commit error,storagefile=" + storage.filePath);
                                return _context6.abrupt("return", { err: err });

                            case 33:
                                _context6.next = 38;
                                break;

                            case 35:
                                this.m_logger.debug("event handler return code " + returnCode + " rollback storage");
                                _context6.next = 38;
                                return work.value.rollback();

                            case 38:
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: returnCode });

                            case 39:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[11, 17]]);
            }));

            function execute(_x15, _x16, _x17) {
                return _ref6.apply(this, arguments);
            }

            return execute;
        }()
    }]);
    return EventExecutor;
}(BaseExecutor);

exports.EventExecutor = EventExecutor;