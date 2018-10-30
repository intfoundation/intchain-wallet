"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

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
var chain_1 = require("../chain");
var error_code_1 = require("../error_code");
var bignumber_js_1 = require("bignumber.js");
var chain_2 = require("./chain");

var ValuePendingTransactions = function (_chain_1$PendingTrans) {
    (0, _inherits3.default)(ValuePendingTransactions, _chain_1$PendingTrans);

    function ValuePendingTransactions() {
        (0, _classCallCheck3.default)(this, ValuePendingTransactions);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ValuePendingTransactions.__proto__ || (0, _getPrototypeOf2.default)(ValuePendingTransactions)).apply(this, arguments));

        _this.m_balance = new _map2.default();
        return _this;
    }

    (0, _createClass3.default)(ValuePendingTransactions, [{
        key: "addTransaction",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(tx) {
                var br, balance, totalUse, err;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.getBalance(tx.address);

                            case 2:
                                br = _context.sent;

                                if (!br.err) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return", br.err);

                            case 5:
                                balance = br.value;
                                totalUse = tx.value;

                                if (!balance.lt(totalUse.plus(tx.fee))) {
                                    _context.next = 10;
                                    break;
                                }

                                this.m_logger.error("addTransaction failed, need fee " + tx.fee.toString() + " but balance " + balance.toString());
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_NOT_ENOUGH);

                            case 10:
                                _context.next = 12;
                                return (0, _get3.default)(ValuePendingTransactions.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValuePendingTransactions.prototype), "addTransaction", this).call(this, tx);

                            case 12:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 15;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 15:
                                return _context.abrupt("return", this._updateBalance(tx.address, balance.minus(totalUse)));

                            case 16:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function addTransaction(_x) {
                return _ref.apply(this, arguments);
            }

            return addTransaction;
        }()
    }, {
        key: "updateTipBlock",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(header) {
                var err;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                err = (0, _get3.default)(ValuePendingTransactions.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValuePendingTransactions.prototype), "updateTipBlock", this).call(this, header);

                                if (!err) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt("return", err);

                            case 3:
                                this.m_balance = new _map2.default();
                                return _context2.abrupt("return", err);

                            case 5:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function updateTipBlock(_x2) {
                return _ref2.apply(this, arguments);
            }

            return updateTipBlock;
        }()
    }, {
        key: "getStorageBalance",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(s) {
                var dbr, kvr, ret;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return this.m_storageView.getReadableDataBase(chain_1.Chain.dbSystem);

                            case 3:
                                dbr = _context3.sent;

                                if (!dbr.err) {
                                    _context3.next = 6;
                                    break;
                                }

                                return _context3.abrupt("return", { err: dbr.err });

                            case 6:
                                _context3.next = 8;
                                return dbr.value.getReadableKeyValue(chain_2.ValueChain.kvBalance);

                            case 8:
                                kvr = _context3.sent;

                                if (!(kvr.err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context3.next = 11;
                                    break;
                                }

                                return _context3.abrupt("return", { err: kvr.err });

                            case 11:
                                _context3.next = 13;
                                return kvr.kv.get(s);

                            case 13:
                                ret = _context3.sent;

                                if (ret.err) {
                                    _context3.next = 18;
                                    break;
                                }

                                return _context3.abrupt("return", ret);

                            case 18:
                                if (!(ret.err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context3.next = 22;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: new bignumber_js_1.BigNumber(0) });

                            case 22:
                                return _context3.abrupt("return", { err: ret.err });

                            case 23:
                                _context3.next = 29;
                                break;

                            case 25:
                                _context3.prev = 25;
                                _context3.t0 = _context3["catch"](0);

                                this.m_logger.error("getStorageBalance error=" + _context3.t0);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 29:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0, 25]]);
            }));

            function getStorageBalance(_x3) {
                return _ref3.apply(this, arguments);
            }

            return getStorageBalance;
        }()
        // 获取pending中的balance

    }, {
        key: "getBalance",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(s) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!this.m_balance.has(s)) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: this.m_balance.get(s) });

                            case 2:
                                return _context4.abrupt("return", this.getStorageBalance(s));

                            case 3:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getBalance(_x4) {
                return _ref4.apply(this, arguments);
            }

            return getBalance;
        }()
    }, {
        key: "checkSmallNonceTx",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(txNew, txOld) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!txNew.fee.gt(txOld.fee)) {
                                    _context5.next = 2;
                                    break;
                                }

                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_FEE_TOO_SMALL);

                            case 3:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function checkSmallNonceTx(_x5, _x6) {
                return _ref5.apply(this, arguments);
            }

            return checkSmallNonceTx;
        }()
    }, {
        key: "_updateBalance",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(address, v) {
                var br;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.getStorageBalance(address);

                            case 2:
                                br = _context6.sent;

                                if (!br.err) {
                                    _context6.next = 5;
                                    break;
                                }

                                return _context6.abrupt("return", br.err);

                            case 5:
                                if (br.value.isEqualTo(v) && this.m_balance.has(address)) {
                                    this.m_balance.delete(address);
                                } else {
                                    this.m_balance.set(address, v);
                                }
                                return _context6.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 7:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function _updateBalance(_x7, _x8) {
                return _ref6.apply(this, arguments);
            }

            return _updateBalance;
        }()
    }, {
        key: "addToQueue",
        value: function addToQueue(txTime) {
            var pos = 0;
            for (var i = 0; i < this.m_transactions.length; i++) {
                if (this.m_transactions[i].tx.address === txTime.tx.address) {
                    pos = this.m_transactions[i].tx.nonce < txTime.tx.nonce ? i + 1 : i;
                } else {
                    pos = this.m_transactions[i].tx.fee.lt(txTime.tx.fee) ? i : i + 1;
                }
            }
            this.m_transactions.splice(pos, 0, txTime);
            this.m_mapNonce.set(txTime.tx.address, txTime.tx.nonce);
        }
    }, {
        key: "onReplaceTx",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(txNew, txOld) {
                var br;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.getBalance(txNew.address);

                            case 2:
                                br = _context7.sent;

                                if (!br.err) {
                                    _context7.next = 5;
                                    break;
                                }

                                return _context7.abrupt("return");

                            case 5:
                                _context7.next = 7;
                                return this._updateBalance(txNew.address, br.value.plus(txOld.value).minus(txNew.value).plus(txOld.fee).minus(txNew.fee));

                            case 7:
                                return _context7.abrupt("return");

                            case 8:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function onReplaceTx(_x9, _x10) {
                return _ref7.apply(this, arguments);
            }

            return onReplaceTx;
        }()
    }]);
    return ValuePendingTransactions;
}(chain_1.PendingTransactions);

exports.ValuePendingTransactions = ValuePendingTransactions;