"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("../error_code");
var chain_1 = require("../chain");
var transaction_1 = require("./transaction");

var BlockExecutor = function () {
    function BlockExecutor(options) {
        (0, _classCallCheck3.default)(this, BlockExecutor);

        this.m_storage = options.storage;
        this.m_handler = options.handler;
        this.m_block = options.block;
        this.m_externContext = options.externContext;
        this.m_logger = options.logger;
        Object.defineProperty(this.m_externContext, 'logger', {
            writable: false,
            value: this.m_logger
        });
        this.m_globalOptions = options.globalOptions;
    }

    (0, _createClass3.default)(BlockExecutor, [{
        key: "_newTransactionExecutor",
        value: function _newTransactionExecutor(l, tx) {
            return new transaction_1.TransactionExecutor(l, tx, this.m_logger);
        }
    }, {
        key: "_newEventExecutor",
        value: function _newEventExecutor(l) {
            return new transaction_1.EventExecutor(l, this.m_logger);
        }
    }, {
        key: "execute",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this._execute(this.m_block);

                            case 2:
                                return _context.abrupt("return", _context.sent);

                            case 3:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function execute() {
                return _ref.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: "verify",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(logger) {
                var oldBlock, err;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                oldBlock = this.m_block;

                                this.m_block = this.m_block.clone();
                                _context2.next = 4;
                                return this.execute();

                            case 4:
                                err = _context2.sent;

                                if (!err) {
                                    _context2.next = 7;
                                    break;
                                }

                                return _context2.abrupt("return", { err: err });

                            case 7:
                                if (this.m_block.hash !== oldBlock.hash) {
                                    logger.error("block " + oldBlock.number + " hash mismatch!! \n            except storage hash " + oldBlock.header.storageHash + ", actual " + this.m_block.header.storageHash + "\n            except hash " + oldBlock.hash + ", actual " + this.m_block.hash + "\n            ");
                                }
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK,
                                    valid: this.m_block.hash === oldBlock.hash });

                            case 9:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function verify(_x) {
                return _ref2.apply(this, arguments);
            }

            return verify;
        }()
    }, {
        key: "_execute",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(block) {
                var err, ret, receipts;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.m_logger.info("begin execute block " + block.number);
                                this.m_storage.createLogger();
                                _context3.next = 4;
                                return this._executePreBlockEvent();

                            case 4:
                                err = _context3.sent;

                                if (!err) {
                                    _context3.next = 8;
                                    break;
                                }

                                this.m_logger.error("blockexecutor execute begin_event failed,errcode=" + err + ",blockhash=" + block.hash);
                                return _context3.abrupt("return", err);

                            case 8:
                                _context3.next = 10;
                                return this._executeTransactions();

                            case 10:
                                ret = _context3.sent;

                                if (!ret.err) {
                                    _context3.next = 14;
                                    break;
                                }

                                this.m_logger.error("blockexecutor execute method failed,errcode=" + ret.err + ",blockhash=" + block.hash);
                                return _context3.abrupt("return", ret.err);

                            case 14:
                                _context3.next = 16;
                                return this._executePostBlockEvent();

                            case 16:
                                err = _context3.sent;

                                if (!err) {
                                    _context3.next = 20;
                                    break;
                                }

                                this.m_logger.error("blockexecutor execute end_event failed,errcode=" + err + ",blockhash=" + block.hash);
                                return _context3.abrupt("return", err);

                            case 20:
                                receipts = ret.value;
                                // 票据

                                block.content.setReceipts(receipts);
                                // 更新块信息
                                _context3.next = 24;
                                return this.updateBlock(block);

                            case 24:
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 25:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _execute(_x2) {
                return _ref3.apply(this, arguments);
            }

            return _execute;
        }()
    }, {
        key: "executeBlockEvent",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(listener) {
                var exec, ret;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                exec = this._newEventExecutor(listener);
                                _context4.next = 3;
                                return exec.execute(this.m_block.header, this.m_storage, this.m_externContext);

                            case 3:
                                ret = _context4.sent;

                                if (!(ret.err || ret.returnCode)) {
                                    _context4.next = 7;
                                    break;
                                }

                                this.m_logger.error("block event execute failed");
                                return _context4.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 7:
                                return _context4.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 8:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function executeBlockEvent(_x3) {
                return _ref4.apply(this, arguments);
            }

            return executeBlockEvent;
        }()
    }, {
        key: "_executePreBlockEvent",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var err, listeners, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, l, _err;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(this.m_block.number === 0)) {
                                    _context5.next = 8;
                                    break;
                                }

                                if (!this.m_handler.genesisListener) {
                                    _context5.next = 8;
                                    break;
                                }

                                _context5.next = 4;
                                return this.executeBlockEvent(this.m_handler.genesisListener);

                            case 4:
                                err = _context5.sent;

                                if (!err) {
                                    _context5.next = 8;
                                    break;
                                }

                                this.m_logger.error("handler's genesisListener execute failed");
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 8:
                                _context5.next = 10;
                                return this.m_handler.getPreBlockListeners(this.m_block.number);

                            case 10:
                                listeners = _context5.sent;
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context5.prev = 14;
                                _iterator = (0, _getIterator3.default)(listeners);

                            case 16:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context5.next = 26;
                                    break;
                                }

                                l = _step.value;
                                _context5.next = 20;
                                return this.executeBlockEvent(l);

                            case 20:
                                _err = _context5.sent;

                                if (!_err) {
                                    _context5.next = 23;
                                    break;
                                }

                                return _context5.abrupt("return", _err);

                            case 23:
                                _iteratorNormalCompletion = true;
                                _context5.next = 16;
                                break;

                            case 26:
                                _context5.next = 32;
                                break;

                            case 28:
                                _context5.prev = 28;
                                _context5.t0 = _context5["catch"](14);
                                _didIteratorError = true;
                                _iteratorError = _context5.t0;

                            case 32:
                                _context5.prev = 32;
                                _context5.prev = 33;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 35:
                                _context5.prev = 35;

                                if (!_didIteratorError) {
                                    _context5.next = 38;
                                    break;
                                }

                                throw _iteratorError;

                            case 38:
                                return _context5.finish(35);

                            case 39:
                                return _context5.finish(32);

                            case 40:
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 41:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[14, 28, 32, 40], [33,, 35, 39]]);
            }));

            function _executePreBlockEvent() {
                return _ref5.apply(this, arguments);
            }

            return _executePreBlockEvent;
        }()
    }, {
        key: "_executePostBlockEvent",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var listeners, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, l, err;

                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.m_handler.getPostBlockListeners(this.m_block.number);

                            case 2:
                                listeners = _context6.sent;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context6.prev = 6;
                                _iterator2 = (0, _getIterator3.default)(listeners);

                            case 8:
                                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                    _context6.next = 16;
                                    break;
                                }

                                l = _step2.value;
                                err = this.executeBlockEvent(l);

                                if (!err) {
                                    _context6.next = 13;
                                    break;
                                }

                                return _context6.abrupt("return", err);

                            case 13:
                                _iteratorNormalCompletion2 = true;
                                _context6.next = 8;
                                break;

                            case 16:
                                _context6.next = 22;
                                break;

                            case 18:
                                _context6.prev = 18;
                                _context6.t0 = _context6["catch"](6);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context6.t0;

                            case 22:
                                _context6.prev = 22;
                                _context6.prev = 23;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 25:
                                _context6.prev = 25;

                                if (!_didIteratorError2) {
                                    _context6.next = 28;
                                    break;
                                }

                                throw _iteratorError2;

                            case 28:
                                return _context6.finish(25);

                            case 29:
                                return _context6.finish(22);

                            case 30:
                                return _context6.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 31:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[6, 18, 22, 30], [23,, 25, 29]]);
            }));

            function _executePostBlockEvent() {
                return _ref6.apply(this, arguments);
            }

            return _executePostBlockEvent;
        }()
    }, {
        key: "_executeTransactions",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                var receipts, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, tx, ret;

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                receipts = [];
                                // 执行tx

                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context7.prev = 4;
                                _iterator3 = (0, _getIterator3.default)(this.m_block.content.transactions);

                            case 6:
                                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                    _context7.next = 17;
                                    break;
                                }

                                tx = _step3.value;
                                _context7.next = 10;
                                return this.executeTransaction(tx);

                            case 10:
                                ret = _context7.sent;

                                if (!ret.err) {
                                    _context7.next = 13;
                                    break;
                                }

                                return _context7.abrupt("return", { err: ret.err });

                            case 13:
                                receipts.push(ret.receipt);

                            case 14:
                                _iteratorNormalCompletion3 = true;
                                _context7.next = 6;
                                break;

                            case 17:
                                _context7.next = 23;
                                break;

                            case 19:
                                _context7.prev = 19;
                                _context7.t0 = _context7["catch"](4);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context7.t0;

                            case 23:
                                _context7.prev = 23;
                                _context7.prev = 24;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 26:
                                _context7.prev = 26;

                                if (!_didIteratorError3) {
                                    _context7.next = 29;
                                    break;
                                }

                                throw _iteratorError3;

                            case 29:
                                return _context7.finish(26);

                            case 30:
                                return _context7.finish(23);

                            case 31:
                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: receipts });

                            case 32:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[4, 19, 23, 31], [24,, 26, 30]]);
            }));

            function _executeTransactions() {
                return _ref7.apply(this, arguments);
            }

            return _executeTransactions;
        }()
    }, {
        key: "executeTransaction",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(tx, flag) {
                var listener, receipt, exec, ret;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                listener = this.m_handler.getListener(tx.method);

                                if (listener) {
                                    _context8.next = 7;
                                    break;
                                }

                                this.m_logger.error("not find listener,method name=" + tx.method);
                                receipt = new chain_1.Receipt();

                                receipt.returnCode = error_code_1.ErrorCode.RESULT_NOT_SUPPORT;
                                receipt.transactionHash = tx.hash;
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, receipt: receipt });

                            case 7:
                                exec = this._newTransactionExecutor(listener, tx);
                                _context8.next = 10;
                                return exec.execute(this.m_block.header, this.m_storage, this.m_externContext, flag);

                            case 10:
                                ret = _context8.sent;
                                return _context8.abrupt("return", ret);

                            case 12:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function executeTransaction(_x4, _x5) {
                return _ref8.apply(this, arguments);
            }

            return executeTransaction;
        }()
    }, {
        key: "updateBlock",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(block) {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.m_storage.messageDigest();

                            case 2:
                                block.header.storageHash = _context9.sent.value;

                                block.header.updateContent(block.content);
                                block.header.updateHash();

                            case 5:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function updateBlock(_x6) {
                return _ref9.apply(this, arguments);
            }

            return updateBlock;
        }()
    }, {
        key: "externContext",
        get: function get() {
            return this.m_externContext;
        }
    }]);
    return BlockExecutor;
}();

exports.BlockExecutor = BlockExecutor;