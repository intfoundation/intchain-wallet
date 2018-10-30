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
var assert = require('assert');
var initSql = 'CREATE TABLE IF NOT EXISTS "txview"("txhash" CHAR(64) PRIMARY KEY NOT NULL UNIQUE, "address" CHAR(64) NOT NULL, "blockheight" INTEGER NOT NULL, "blockhash" CHAR(64) NOT NULL);';

var TxStorage = function () {
    function TxStorage(options) {
        (0, _classCallCheck3.default)(this, TxStorage);

        this.m_db = options.db;
        this.m_logger = options.logger;
        this.m_blockStorage = options.blockstorage;
    }

    (0, _createClass3.default)(TxStorage, [{
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return this.m_db.run(initSql);

                            case 3:
                                _context.next = 9;
                                break;

                            case 5:
                                _context.prev = 5;
                                _context.t0 = _context["catch"](0);

                                this.m_logger.error(_context.t0);
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 9:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 10:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 5]]);
            }));

            function init() {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "uninit",
        value: function uninit() {
            // do nothing
        }
    }, {
        key: "add",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(blockhash) {
                var block, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tx;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (this.m_blockStorage.has(blockhash)) {
                                    _context2.next = 3;
                                    break;
                                }

                                assert(false, "can't find block " + blockhash + " when update tx storage");
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_NOT_FOUND);

                            case 3:
                                block = this.m_blockStorage.get(blockhash);

                                if (block) {
                                    _context2.next = 7;
                                    break;
                                }

                                this.m_logger.error("can't load " + blockhash + " when update tx storage");
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_BLOCK);

                            case 7:
                                _context2.prev = 7;
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context2.prev = 11;
                                _iterator = (0, _getIterator3.default)(block.content.transactions);

                            case 13:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context2.next = 20;
                                    break;
                                }

                                tx = _step.value;
                                _context2.next = 17;
                                return this.m_db.run("insert into txview (txhash, address, blockheight, blockhash) values (\"" + tx.hash + "\",\"" + tx.address + "\", " + block.number + ", \"" + block.hash + "\")");

                            case 17:
                                _iteratorNormalCompletion = true;
                                _context2.next = 13;
                                break;

                            case 20:
                                _context2.next = 26;
                                break;

                            case 22:
                                _context2.prev = 22;
                                _context2.t0 = _context2["catch"](11);
                                _didIteratorError = true;
                                _iteratorError = _context2.t0;

                            case 26:
                                _context2.prev = 26;
                                _context2.prev = 27;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 29:
                                _context2.prev = 29;

                                if (!_didIteratorError) {
                                    _context2.next = 32;
                                    break;
                                }

                                throw _iteratorError;

                            case 32:
                                return _context2.finish(29);

                            case 33:
                                return _context2.finish(26);

                            case 34:
                                _context2.next = 40;
                                break;

                            case 36:
                                _context2.prev = 36;
                                _context2.t1 = _context2["catch"](7);

                                this.m_logger.error("add exception,error=" + _context2.t1 + ",blockhash=" + blockhash);
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 40:
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 41:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[7, 36], [11, 22, 26, 34], [27,, 29, 33]]);
            }));

            function add(_x) {
                return _ref2.apply(this, arguments);
            }

            return add;
        }()
    }, {
        key: "remove",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(nBlockHeight) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return this.m_db.run("delete from txview where blockheight > " + nBlockHeight);

                            case 3:
                                _context3.next = 9;
                                break;

                            case 5:
                                _context3.prev = 5;
                                _context3.t0 = _context3["catch"](0);

                                this.m_logger.error("remove exception,error=" + _context3.t0 + ",height=" + nBlockHeight);
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 9:
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 10:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0, 5]]);
            }));

            function remove(_x2) {
                return _ref3.apply(this, arguments);
            }

            return remove;
        }()
    }, {
        key: "get",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(txHash) {
                var result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                _context4.next = 3;
                                return this.m_db.get("select blockhash from txview where txhash=\"" + txHash + "\"");

                            case 3:
                                result = _context4.sent;

                                if (!(!result || result.blockhash === undefined)) {
                                    _context4.next = 6;
                                    break;
                                }

                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 6:
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, blockhash: result.blockhash });

                            case 9:
                                _context4.prev = 9;
                                _context4.t0 = _context4["catch"](0);

                                this.m_logger.error("get exception,error=" + _context4.t0 + ",txHash=" + txHash);
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 13:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 9]]);
            }));

            function get(_x3) {
                return _ref4.apply(this, arguments);
            }

            return get;
        }()
    }, {
        key: "getCountByAddress",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(address) {
                var result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                _context5.next = 3;
                                return this.m_db.get("select count(*) as value from txview where address=\"" + address + "\"");

                            case 3:
                                result = _context5.sent;

                                if (!(!result || result.value === undefined)) {
                                    _context5.next = 6;
                                    break;
                                }

                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_FAILED });

                            case 6:
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, count: result.value });

                            case 9:
                                _context5.prev = 9;
                                _context5.t0 = _context5["catch"](0);

                                this.m_logger.error("getCountByAddress exception,error=" + _context5.t0 + ",address=" + address);
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 13:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 9]]);
            }));

            function getCountByAddress(_x4) {
                return _ref5.apply(this, arguments);
            }

            return getCountByAddress;
        }()
    }]);
    return TxStorage;
}();

exports.TxStorage = TxStorage;