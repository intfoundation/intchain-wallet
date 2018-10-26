"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

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
var bignumber_js_1 = require("bignumber.js");

var ViewContext = function () {
    function ViewContext(kvBalance) {
        (0, _classCallCheck3.default)(this, ViewContext);

        this.kvBalance = kvBalance;
    }

    (0, _createClass3.default)(ViewContext, [{
        key: "getBalance",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(address) {
                var retInfo;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.kvBalance.get(address);

                            case 2:
                                retInfo = _context.sent;
                                return _context.abrupt("return", retInfo.err === error_code_1.ErrorCode.RESULT_OK ? retInfo.value : new bignumber_js_1.BigNumber(0));

                            case 4:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getBalance(_x) {
                return _ref.apply(this, arguments);
            }

            return getBalance;
        }()
    }]);
    return ViewContext;
}();

exports.ViewContext = ViewContext;

var Context = function (_ViewContext) {
    (0, _inherits3.default)(Context, _ViewContext);

    function Context(kvBalance) {
        (0, _classCallCheck3.default)(this, Context);
        return (0, _possibleConstructorReturn3.default)(this, (Context.__proto__ || (0, _getPrototypeOf2.default)(Context)).call(this, kvBalance));
    }

    (0, _createClass3.default)(Context, [{
        key: "transferTo",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(from, to, amount) {
                var fromTotal;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.getBalance(from);

                            case 2:
                                fromTotal = _context2.sent;

                                if (!fromTotal.lt(amount)) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_NOT_ENOUGH);

                            case 5:
                                _context2.next = 7;
                                return this.kvBalance.set(from, fromTotal.minus(amount));

                            case 7:
                                _context2.t0 = this.kvBalance;
                                _context2.t1 = to;
                                _context2.next = 11;
                                return this.getBalance(to);

                            case 11:
                                _context2.t2 = amount;
                                _context2.t3 = _context2.sent.plus(_context2.t2);
                                _context2.next = 15;
                                return _context2.t0.set.call(_context2.t0, _context2.t1, _context2.t3);

                            case 15:
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 16:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function transferTo(_x2, _x3, _x4) {
                return _ref2.apply(this, arguments);
            }

            return transferTo;
        }()
    }, {
        key: "issue",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(to, amount) {
                var sh;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.t0 = this.kvBalance;
                                _context3.t1 = to;
                                _context3.next = 4;
                                return this.getBalance(to);

                            case 4:
                                _context3.t2 = amount;
                                _context3.t3 = _context3.sent.plus(_context3.t2);
                                _context3.next = 8;
                                return _context3.t0.set.call(_context3.t0, _context3.t1, _context3.t3);

                            case 8:
                                sh = _context3.sent;
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 10:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function issue(_x5, _x6) {
                return _ref3.apply(this, arguments);
            }

            return issue;
        }()
    }]);
    return Context;
}(ViewContext);

exports.Context = Context;