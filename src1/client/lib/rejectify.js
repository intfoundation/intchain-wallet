"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
function rejectifyValue(func, _this) {
    var _this2 = this;

    var _func = function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _ref2, err, value;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return func(args);

                        case 2:
                            _ref2 = _context.sent;
                            err = _ref2.err;
                            value = _ref2.value;

                            if (!err) {
                                _context.next = 9;
                                break;
                            }

                            return _context.abrupt("return", _promise2.default.reject(new Error("" + err)));

                        case 9:
                            return _context.abrupt("return", _promise2.default.resolve(value));

                        case 10:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, _this2);
        }));

        return function _func() {
            return _ref.apply(this, arguments);
        };
    }();
    _func.bind(_this);
    return _func;
}
exports.rejectifyValue = rejectifyValue;
function rejectifyErrorCode(func, _this) {
    var _this3 = this;

    var _func = function () {
        var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var err;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return func(args);

                        case 2:
                            err = _context2.sent;

                            if (!err) {
                                _context2.next = 7;
                                break;
                            }

                            return _context2.abrupt("return", _promise2.default.reject(new Error("" + err)));

                        case 7:
                            return _context2.abrupt("return", _promise2.default.resolve());

                        case 8:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this3);
        }));

        return function _func() {
            return _ref3.apply(this, arguments);
        };
    }();
    _func.bind(_this);
    return _func;
}
exports.rejectifyErrorCode = rejectifyErrorCode;