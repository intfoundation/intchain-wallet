"use strict";

var _setImmediate2 = require("babel-runtime/core-js/set-immediate");

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _values = require("babel-runtime/core-js/object/values");

var _values2 = _interopRequireDefault(_values);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

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
var assert = require("assert");
var fs = require("fs-extra");
var path = require("path");
var error_code_1 = require("../error_code");
var serializable_1 = require("../serializable");
var storage_1 = require("../storage");
var util_1 = require("util");

var JsonStorageKeyValue = function () {
    function JsonStorageKeyValue(dbRoot, name, logger) {
        (0, _classCallCheck3.default)(this, JsonStorageKeyValue);

        this.name = name;
        this.logger = logger;
        this.m_root = dbRoot[name];
    }

    (0, _createClass3.default)(JsonStorageKeyValue, [{
        key: "set",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(key, value) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;

                                assert(key);
                                this.m_root[key] = serializable_1.deepCopy(value);
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 6:
                                _context.prev = 6;
                                _context.t0 = _context["catch"](0);

                                this.logger.error("set " + key + " ", _context.t0);
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 10:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 6]]);
            }));

            function set(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return set;
        }()
    }, {
        key: "get",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(key) {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;

                                assert(key);

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context2.next = 4;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 4:
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.deepCopy(this.m_root[key]) });

                            case 7:
                                _context2.prev = 7;
                                _context2.t0 = _context2["catch"](0);

                                this.logger.error("get " + key + " ", _context2.t0);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 7]]);
            }));

            function get(_x3) {
                return _ref2.apply(this, arguments);
            }

            return get;
        }()
    }, {
        key: "hset",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(key, field, value) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;

                                assert(key);
                                assert(field);
                                if (!this.m_root[key]) {
                                    this.m_root[key] = (0, _create2.default)(null);
                                }
                                this.m_root[key][field] = serializable_1.deepCopy(value);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 8:
                                _context3.prev = 8;
                                _context3.t0 = _context3["catch"](0);

                                this.logger.error("hset " + key + " " + field + " ", _context3.t0);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 12:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0, 8]]);
            }));

            function hset(_x4, _x5, _x6) {
                return _ref3.apply(this, arguments);
            }

            return hset;
        }()
    }, {
        key: "hget",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(key, field) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;

                                assert(key);
                                assert(field);

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context4.next = 5;
                                    break;
                                }

                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 5:
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.deepCopy(this.m_root[key][field]) });

                            case 8:
                                _context4.prev = 8;
                                _context4.t0 = _context4["catch"](0);

                                this.logger.error("hget " + key + " " + field + " ", _context4.t0);
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 12:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 8]]);
            }));

            function hget(_x7, _x8) {
                return _ref4.apply(this, arguments);
            }

            return hget;
        }()
    }, {
        key: "hdel",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(key, field) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context5.next = 3;
                                    break;
                                }

                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 3:
                                delete this.m_root[key][field];
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 7:
                                _context5.prev = 7;
                                _context5.t0 = _context5["catch"](0);

                                this.logger.error("hdel " + key + " " + field + " ", _context5.t0);
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 7]]);
            }));

            function hdel(_x9, _x10) {
                return _ref5.apply(this, arguments);
            }

            return hdel;
        }()
    }, {
        key: "hlen",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(key) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.prev = 0;

                                assert(key);

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context6.next = 4;
                                    break;
                                }

                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 4:
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: (0, _keys2.default)(this.m_root[key]).length });

                            case 7:
                                _context6.prev = 7;
                                _context6.t0 = _context6["catch"](0);

                                this.logger.error("hlen " + key + " ", _context6.t0);
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[0, 7]]);
            }));

            function hlen(_x11) {
                return _ref6.apply(this, arguments);
            }

            return hlen;
        }()
    }, {
        key: "hexists",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(key, field) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.prev = 0;

                                assert(key);
                                assert(field);

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context7.next = 5;
                                    break;
                                }

                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 5:
                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: !util_1.isUndefined(this.m_root[key][field]) });

                            case 8:
                                _context7.prev = 8;
                                _context7.t0 = _context7["catch"](0);

                                this.logger.error("hexsits " + key + " " + field, _context7.t0);
                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 12:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 8]]);
            }));

            function hexists(_x12, _x13) {
                return _ref7.apply(this, arguments);
            }

            return hexists;
        }()
    }, {
        key: "hmset",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(key, fields, values) {
                var ix;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;

                                assert(key);
                                assert(fields.length === values.length);
                                if (!this.m_root[key]) {
                                    this.m_root[key] = (0, _create2.default)(null);
                                }
                                for (ix = 0; ix < fields.length; ++ix) {
                                    this.m_root[key][fields[ix]] = serializable_1.deepCopy(values[ix]);
                                }
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 8:
                                _context8.prev = 8;
                                _context8.t0 = _context8["catch"](0);

                                this.logger.error("hmset " + key + " " + fields + " ", _context8.t0);
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 12:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 8]]);
            }));

            function hmset(_x14, _x15, _x16) {
                return _ref8.apply(this, arguments);
            }

            return hmset;
        }()
    }, {
        key: "hmget",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(key, fields) {
                var values, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, f;

                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;

                                assert(key);

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context9.next = 4;
                                    break;
                                }

                                return _context9.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 4:
                                values = [];
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context9.prev = 8;

                                for (_iterator = (0, _getIterator3.default)(fields); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    f = _step.value;

                                    values.push(serializable_1.deepCopy(this.m_root[key][f]));
                                }
                                _context9.next = 16;
                                break;

                            case 12:
                                _context9.prev = 12;
                                _context9.t0 = _context9["catch"](8);
                                _didIteratorError = true;
                                _iteratorError = _context9.t0;

                            case 16:
                                _context9.prev = 16;
                                _context9.prev = 17;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 19:
                                _context9.prev = 19;

                                if (!_didIteratorError) {
                                    _context9.next = 22;
                                    break;
                                }

                                throw _iteratorError;

                            case 22:
                                return _context9.finish(19);

                            case 23:
                                return _context9.finish(16);

                            case 24:
                                return _context9.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: values });

                            case 27:
                                _context9.prev = 27;
                                _context9.t1 = _context9["catch"](0);

                                this.logger.error("hmget " + key + " " + fields + " ", _context9.t1);
                                return _context9.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 31:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 27], [8, 12, 16, 24], [17,, 19, 23]]);
            }));

            function hmget(_x17, _x18) {
                return _ref9.apply(this, arguments);
            }

            return hmget;
        }()
    }, {
        key: "hkeys",
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(key) {
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.prev = 0;

                                assert(key);

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context10.next = 4;
                                    break;
                                }

                                return _context10.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 4:
                                return _context10.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: (0, _keys2.default)(this.m_root[key]) });

                            case 7:
                                _context10.prev = 7;
                                _context10.t0 = _context10["catch"](0);

                                this.logger.error("hkeys " + key + " ", _context10.t0);
                                return _context10.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[0, 7]]);
            }));

            function hkeys(_x19) {
                return _ref10.apply(this, arguments);
            }

            return hkeys;
        }()
    }, {
        key: "hvalues",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(key) {
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.prev = 0;

                                assert(key);

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context11.next = 4;
                                    break;
                                }

                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 4:
                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: (0, _values2.default)(this.m_root[key]).map(function (x) {
                                        return serializable_1.deepCopy(x);
                                    }) });

                            case 7:
                                _context11.prev = 7;
                                _context11.t0 = _context11["catch"](0);

                                this.logger.error("hvalues " + key + " ", _context11.t0);
                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[0, 7]]);
            }));

            function hvalues(_x20) {
                return _ref11.apply(this, arguments);
            }

            return hvalues;
        }()
    }, {
        key: "hgetall",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(key) {
                var _this = this;

                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.prev = 0;

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context12.next = 3;
                                    break;
                                }

                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 3:
                                return _context12.abrupt("return", {
                                    err: error_code_1.ErrorCode.RESULT_OK, value: (0, _keys2.default)(this.m_root[key]).map(function (x) {
                                        return { key: x, value: serializable_1.deepCopy(_this.m_root[key][x]) };
                                    })
                                });

                            case 6:
                                _context12.prev = 6;
                                _context12.t0 = _context12["catch"](0);

                                this.logger.error("hgetall " + key + " ", _context12.t0);
                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 10:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[0, 6]]);
            }));

            function hgetall(_x21) {
                return _ref12.apply(this, arguments);
            }

            return hgetall;
        }()
    }, {
        key: "hclean",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(key) {
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.prev = 0;

                                this.m_root[key] = (0, _create2.default)(null);
                                return _context13.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 5:
                                _context13.prev = 5;
                                _context13.t0 = _context13["catch"](0);

                                this.logger.error("hclean " + key + " ", _context13.t0);
                                return _context13.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 9:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this, [[0, 5]]);
            }));

            function hclean(_x22) {
                return _ref13.apply(this, arguments);
            }

            return hclean;
        }()
    }, {
        key: "lindex",
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(key, index) {
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.prev = 0;

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context14.next = 3;
                                    break;
                                }

                                return _context14.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 3:
                                return _context14.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.deepCopy(this.m_root[key][index]) });

                            case 6:
                                _context14.prev = 6;
                                _context14.t0 = _context14["catch"](0);

                                this.logger.error("lindex " + key + " " + index, _context14.t0);
                                return _context14.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 10:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this, [[0, 6]]);
            }));

            function lindex(_x23, _x24) {
                return _ref14.apply(this, arguments);
            }

            return lindex;
        }()
    }, {
        key: "lset",
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(key, index, value) {
                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.prev = 0;

                                assert(key);
                                this.m_root[key][index] = serializable_1.deepCopy(value);
                                return _context15.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 6:
                                _context15.prev = 6;
                                _context15.t0 = _context15["catch"](0);

                                this.logger.error("lset " + key + " " + index + " ", _context15.t0);
                                return _context15.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 10:
                            case "end":
                                return _context15.stop();
                        }
                    }
                }, _callee15, this, [[0, 6]]);
            }));

            function lset(_x25, _x26, _x27) {
                return _ref15.apply(this, arguments);
            }

            return lset;
        }()
    }, {
        key: "llen",
        value: function () {
            var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(key) {
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.prev = 0;

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context16.next = 3;
                                    break;
                                }

                                return _context16.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 3:
                                return _context16.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: this.m_root[key].length });

                            case 6:
                                _context16.prev = 6;
                                _context16.t0 = _context16["catch"](0);

                                this.logger.error("llen " + key + " ", _context16.t0);
                                return _context16.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 10:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this, [[0, 6]]);
            }));

            function llen(_x28) {
                return _ref16.apply(this, arguments);
            }

            return llen;
        }()
    }, {
        key: "lrange",
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(key, start, stop) {
                var _ref18, err, len;

                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.prev = 0;

                                assert(key);

                                if (!util_1.isUndefined(this.m_root[key])) {
                                    _context17.next = 4;
                                    break;
                                }

                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 4:
                                _context17.next = 6;
                                return this.llen(key);

                            case 6:
                                _ref18 = _context17.sent;
                                err = _ref18.err;
                                len = _ref18.value;

                                if (!err) {
                                    _context17.next = 11;
                                    break;
                                }

                                return _context17.abrupt("return", { err: err });

                            case 11:
                                if (len) {
                                    _context17.next = 13;
                                    break;
                                }

                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: [] });

                            case 13:
                                if (start < 0) {
                                    start = len + start;
                                }
                                if (stop < 0) {
                                    stop = len + stop;
                                }
                                if (stop >= len) {
                                    stop = len - 1;
                                }
                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.deepCopy(this.m_root[key].slice(start, stop + 1)) });

                            case 19:
                                _context17.prev = 19;
                                _context17.t0 = _context17["catch"](0);

                                this.logger.error("lrange " + key + " " + start + " " + stop, _context17.t0);
                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 23:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this, [[0, 19]]);
            }));

            function lrange(_x29, _x30, _x31) {
                return _ref17.apply(this, arguments);
            }

            return lrange;
        }()
    }, {
        key: "lpush",
        value: function () {
            var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(key, value) {
                return _regenerator2.default.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _context18.prev = 0;

                                assert(key);
                                if (!this.m_root[key]) {
                                    this.m_root[key] = [];
                                }
                                this.m_root[key].unshift(serializable_1.deepCopy(value));
                                return _context18.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 7:
                                _context18.prev = 7;
                                _context18.t0 = _context18["catch"](0);

                                this.logger.error("lpush " + key + " ", _context18.t0);
                                return _context18.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this, [[0, 7]]);
            }));

            function lpush(_x32, _x33) {
                return _ref19.apply(this, arguments);
            }

            return lpush;
        }()
    }, {
        key: "lpushx",
        value: function () {
            var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(key, value) {
                var _m_root$key;

                return _regenerator2.default.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.prev = 0;

                                assert(key);
                                if (!this.m_root[key]) {
                                    this.m_root[key] = [];
                                }
                                (_m_root$key = this.m_root[key]).unshift.apply(_m_root$key, (0, _toConsumableArray3.default)(value.map(function (e) {
                                    return serializable_1.deepCopy(e);
                                })));
                                return _context19.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 7:
                                _context19.prev = 7;
                                _context19.t0 = _context19["catch"](0);

                                this.logger.error("lpushx " + key + " ", _context19.t0);
                                return _context19.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context19.stop();
                        }
                    }
                }, _callee19, this, [[0, 7]]);
            }));

            function lpushx(_x34, _x35) {
                return _ref20.apply(this, arguments);
            }

            return lpushx;
        }()
    }, {
        key: "lpop",
        value: function () {
            var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(key) {
                return _regenerator2.default.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                _context20.prev = 0;

                                assert(key);
                                return _context20.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.deepCopy(this.m_root[key].shift()) });

                            case 5:
                                _context20.prev = 5;
                                _context20.t0 = _context20["catch"](0);

                                this.logger.error("lpop " + key + " ", _context20.t0);
                                return _context20.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 9:
                            case "end":
                                return _context20.stop();
                        }
                    }
                }, _callee20, this, [[0, 5]]);
            }));

            function lpop(_x36) {
                return _ref21.apply(this, arguments);
            }

            return lpop;
        }()
    }, {
        key: "rpush",
        value: function () {
            var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(key, value) {
                return _regenerator2.default.wrap(function _callee21$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:
                                _context21.prev = 0;

                                assert(key);
                                if (!this.m_root[key]) {
                                    this.m_root[key] = [];
                                }
                                this.m_root[key].push(serializable_1.deepCopy(value));
                                return _context21.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 7:
                                _context21.prev = 7;
                                _context21.t0 = _context21["catch"](0);

                                this.logger.error("lpush " + key + " ", _context21.t0);
                                return _context21.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context21.stop();
                        }
                    }
                }, _callee21, this, [[0, 7]]);
            }));

            function rpush(_x37, _x38) {
                return _ref22.apply(this, arguments);
            }

            return rpush;
        }()
    }, {
        key: "rpushx",
        value: function () {
            var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22(key, value) {
                var _m_root$key2;

                return _regenerator2.default.wrap(function _callee22$(_context22) {
                    while (1) {
                        switch (_context22.prev = _context22.next) {
                            case 0:
                                _context22.prev = 0;

                                assert(key);
                                if (!this.m_root[key]) {
                                    this.m_root[key] = [];
                                }
                                (_m_root$key2 = this.m_root[key]).push.apply(_m_root$key2, (0, _toConsumableArray3.default)(value.map(function (e) {
                                    return serializable_1.deepCopy(e);
                                })));
                                return _context22.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 7:
                                _context22.prev = 7;
                                _context22.t0 = _context22["catch"](0);

                                this.logger.error("lpushx " + key + " ", _context22.t0);
                                return _context22.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context22.stop();
                        }
                    }
                }, _callee22, this, [[0, 7]]);
            }));

            function rpushx(_x39, _x40) {
                return _ref23.apply(this, arguments);
            }

            return rpushx;
        }()
    }, {
        key: "rpop",
        value: function () {
            var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23(key) {
                return _regenerator2.default.wrap(function _callee23$(_context23) {
                    while (1) {
                        switch (_context23.prev = _context23.next) {
                            case 0:
                                _context23.prev = 0;

                                assert(key);
                                return _context23.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.deepCopy(this.m_root[key].pop()) });

                            case 5:
                                _context23.prev = 5;
                                _context23.t0 = _context23["catch"](0);

                                this.logger.error("lpop " + key + " ", _context23.t0);
                                return _context23.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 9:
                            case "end":
                                return _context23.stop();
                        }
                    }
                }, _callee23, this, [[0, 5]]);
            }));

            function rpop(_x41) {
                return _ref24.apply(this, arguments);
            }

            return rpop;
        }()
    }, {
        key: "linsert",
        value: function () {
            var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(key, index, value) {
                return _regenerator2.default.wrap(function _callee24$(_context24) {
                    while (1) {
                        switch (_context24.prev = _context24.next) {
                            case 0:
                                _context24.prev = 0;

                                assert(key);
                                this.m_root[key].splice(index, 0, serializable_1.deepCopy(value));
                                return _context24.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 6:
                                _context24.prev = 6;
                                _context24.t0 = _context24["catch"](0);

                                this.logger.error("linsert " + key + " " + index + " ", value, _context24.t0);
                                return _context24.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 10:
                            case "end":
                                return _context24.stop();
                        }
                    }
                }, _callee24, this, [[0, 6]]);
            }));

            function linsert(_x42, _x43, _x44) {
                return _ref25.apply(this, arguments);
            }

            return linsert;
        }()
    }, {
        key: "lremove",
        value: function () {
            var _ref26 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25(key, index) {
                return _regenerator2.default.wrap(function _callee25$(_context25) {
                    while (1) {
                        switch (_context25.prev = _context25.next) {
                            case 0:
                                _context25.prev = 0;

                                assert(key);
                                return _context25.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.deepCopy(this.m_root[key].splice(index, 1)[0]) });

                            case 5:
                                _context25.prev = 5;
                                _context25.t0 = _context25["catch"](0);

                                this.logger.error("lremove " + key + " ", _context25.t0);
                                return _context25.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 9:
                            case "end":
                                return _context25.stop();
                        }
                    }
                }, _callee25, this, [[0, 5]]);
            }));

            function lremove(_x45, _x46) {
                return _ref26.apply(this, arguments);
            }

            return lremove;
        }()
    }, {
        key: "root",
        get: function get() {
            var r = this.m_root;
            return r;
        }
    }]);
    return JsonStorageKeyValue;
}();

var JsonDataBase = function () {
    function JsonDataBase(storageRoot, name, logger) {
        (0, _classCallCheck3.default)(this, JsonDataBase);

        this.name = name;
        this.logger = logger;
        this.m_root = storageRoot[name];
    }

    (0, _createClass3.default)(JsonDataBase, [{
        key: "getReadableKeyValue",
        value: function () {
            var _ref27 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26(name) {
                var err, tbl;
                return _regenerator2.default.wrap(function _callee26$(_context26) {
                    while (1) {
                        switch (_context26.prev = _context26.next) {
                            case 0:
                                err = storage_1.Storage.checkTableName(name);

                                if (!err) {
                                    _context26.next = 3;
                                    break;
                                }

                                return _context26.abrupt("return", { err: err });

                            case 3:
                                tbl = new JsonStorageKeyValue(this.m_root, name, this.logger);
                                return _context26.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, kv: tbl });

                            case 5:
                            case "end":
                                return _context26.stop();
                        }
                    }
                }, _callee26, this);
            }));

            function getReadableKeyValue(_x47) {
                return _ref27.apply(this, arguments);
            }

            return getReadableKeyValue;
        }()
    }, {
        key: "createKeyValue",
        value: function () {
            var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27(name) {
                var err, tbl;
                return _regenerator2.default.wrap(function _callee27$(_context27) {
                    while (1) {
                        switch (_context27.prev = _context27.next) {
                            case 0:
                                err = storage_1.Storage.checkTableName(name);

                                if (!err) {
                                    _context27.next = 3;
                                    break;
                                }

                                return _context27.abrupt("return", { err: err });

                            case 3:
                                if (!util_1.isNullOrUndefined(this.m_root[name])) {
                                    err = error_code_1.ErrorCode.RESULT_ALREADY_EXIST;
                                } else {
                                    this.m_root[name] = (0, _create2.default)(null);
                                    err = error_code_1.ErrorCode.RESULT_OK;
                                }
                                tbl = new JsonStorageKeyValue(this.m_root, name, this.logger);
                                return _context27.abrupt("return", { err: err, kv: tbl });

                            case 6:
                            case "end":
                                return _context27.stop();
                        }
                    }
                }, _callee27, this);
            }));

            function createKeyValue(_x48) {
                return _ref28.apply(this, arguments);
            }

            return createKeyValue;
        }()
    }, {
        key: "getReadWritableKeyValue",
        value: function () {
            var _ref29 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28(name) {
                var err, tbl;
                return _regenerator2.default.wrap(function _callee28$(_context28) {
                    while (1) {
                        switch (_context28.prev = _context28.next) {
                            case 0:
                                err = storage_1.Storage.checkTableName(name);

                                if (!err) {
                                    _context28.next = 3;
                                    break;
                                }

                                return _context28.abrupt("return", { err: err });

                            case 3:
                                tbl = new JsonStorageKeyValue(this.m_root, name, this.logger);
                                return _context28.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, kv: tbl });

                            case 5:
                            case "end":
                                return _context28.stop();
                        }
                    }
                }, _callee28, this);
            }));

            function getReadWritableKeyValue(_x49) {
                return _ref29.apply(this, arguments);
            }

            return getReadWritableKeyValue;
        }()
    }, {
        key: "root",
        get: function get() {
            var r = this.m_root;
            return r;
        }
    }]);
    return JsonDataBase;
}();

var JsonStorageTransaction = function () {
    function JsonStorageTransaction(storageRoot) {
        (0, _classCallCheck3.default)(this, JsonStorageTransaction);

        this.m_transactionRoot = serializable_1.deepCopy(storageRoot);
        this.m_storageRoot = storageRoot;
    }

    (0, _createClass3.default)(JsonStorageTransaction, [{
        key: "beginTransaction",
        value: function () {
            var _ref30 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29() {
                return _regenerator2.default.wrap(function _callee29$(_context29) {
                    while (1) {
                        switch (_context29.prev = _context29.next) {
                            case 0:
                                return _context29.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 1:
                            case "end":
                                return _context29.stop();
                        }
                    }
                }, _callee29, this);
            }));

            function beginTransaction() {
                return _ref30.apply(this, arguments);
            }

            return beginTransaction;
        }()
    }, {
        key: "commit",
        value: function () {
            var _ref31 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30() {
                return _regenerator2.default.wrap(function _callee30$(_context30) {
                    while (1) {
                        switch (_context30.prev = _context30.next) {
                            case 0:
                                return _context30.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 1:
                            case "end":
                                return _context30.stop();
                        }
                    }
                }, _callee30, this);
            }));

            function commit() {
                return _ref31.apply(this, arguments);
            }

            return commit;
        }()
    }, {
        key: "rollback",
        value: function () {
            var _ref32 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee31() {
                var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, k;

                return _regenerator2.default.wrap(function _callee31$(_context31) {
                    while (1) {
                        switch (_context31.prev = _context31.next) {
                            case 0:
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context31.prev = 3;

                                for (_iterator2 = (0, _getIterator3.default)((0, _keys2.default)(this.m_storageRoot)); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    k = _step2.value;

                                    delete this.m_storageRoot[k];
                                }
                                _context31.next = 11;
                                break;

                            case 7:
                                _context31.prev = 7;
                                _context31.t0 = _context31["catch"](3);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context31.t0;

                            case 11:
                                _context31.prev = 11;
                                _context31.prev = 12;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 14:
                                _context31.prev = 14;

                                if (!_didIteratorError2) {
                                    _context31.next = 17;
                                    break;
                                }

                                throw _iteratorError2;

                            case 17:
                                return _context31.finish(14);

                            case 18:
                                return _context31.finish(11);

                            case 19:
                                (0, _assign2.default)(this.m_storageRoot, this.m_transactionRoot);
                                return _context31.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 21:
                            case "end":
                                return _context31.stop();
                        }
                    }
                }, _callee31, this, [[3, 7, 11, 19], [12,, 14, 18]]);
            }));

            function rollback() {
                return _ref32.apply(this, arguments);
            }

            return rollback;
        }()
    }]);
    return JsonStorageTransaction;
}();

var JsonStorage = function (_storage_1$Storage) {
    (0, _inherits3.default)(JsonStorage, _storage_1$Storage);

    function JsonStorage() {
        (0, _classCallCheck3.default)(this, JsonStorage);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (JsonStorage.__proto__ || (0, _getPrototypeOf2.default)(JsonStorage)).apply(this, arguments));

        _this2.m_isInit = false;
        return _this2;
    }

    (0, _createClass3.default)(JsonStorage, [{
        key: "_createLogger",
        value: function _createLogger() {
            return new storage_1.JStorageLogger();
        }
    }, {
        key: "init",
        value: function () {
            var _ref33 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee32(readonly) {
                var _this3 = this;

                var options, err;
                return _regenerator2.default.wrap(function _callee32$(_context32) {
                    while (1) {
                        switch (_context32.prev = _context32.next) {
                            case 0:
                                if (!this.m_root) {
                                    _context32.next = 2;
                                    break;
                                }

                                return _context32.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 2:
                                assert(!this.m_root);
                                fs.ensureDirSync(path.dirname(this.m_filePath));
                                options = {};
                                err = error_code_1.ErrorCode.RESULT_OK;

                                if (fs.existsSync(this.m_filePath)) {
                                    try {
                                        this.m_root = fs.readJSONSync(this.m_filePath);
                                    } catch (e) {
                                        err = error_code_1.ErrorCode.RESULT_EXCEPTION;
                                    }
                                } else {
                                    this.m_root = (0, _create2.default)(null);
                                }
                                if (!err) {
                                    this.m_isInit = true;
                                }
                                (0, _setImmediate3.default)(function () {
                                    _this3.m_eventEmitter.emit('init', err);
                                });
                                return _context32.abrupt("return", err);

                            case 10:
                            case "end":
                                return _context32.stop();
                        }
                    }
                }, _callee32, this);
            }));

            function init(_x50) {
                return _ref33.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "uninit",
        value: function () {
            var _ref34 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee33() {
                return _regenerator2.default.wrap(function _callee33$(_context33) {
                    while (1) {
                        switch (_context33.prev = _context33.next) {
                            case 0:
                                if (this.m_root) {
                                    delete this.m_root;
                                }
                                return _context33.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                            case "end":
                                return _context33.stop();
                        }
                    }
                }, _callee33, this);
            }));

            function uninit() {
                return _ref34.apply(this, arguments);
            }

            return uninit;
        }()
    }, {
        key: "getReadableDataBase",
        value: function () {
            var _ref35 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee34(name) {
                var err;
                return _regenerator2.default.wrap(function _callee34$(_context34) {
                    while (1) {
                        switch (_context34.prev = _context34.next) {
                            case 0:
                                err = storage_1.Storage.checkDataBaseName(name);

                                if (!err) {
                                    _context34.next = 3;
                                    break;
                                }

                                return _context34.abrupt("return", { err: err });

                            case 3:
                                return _context34.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: new JsonDataBase(this.m_root, name, this.m_logger) });

                            case 4:
                            case "end":
                                return _context34.stop();
                        }
                    }
                }, _callee34, this);
            }));

            function getReadableDataBase(_x51) {
                return _ref35.apply(this, arguments);
            }

            return getReadableDataBase;
        }()
    }, {
        key: "createDatabase",
        value: function () {
            var _ref36 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee35(name) {
                var err;
                return _regenerator2.default.wrap(function _callee35$(_context35) {
                    while (1) {
                        switch (_context35.prev = _context35.next) {
                            case 0:
                                err = storage_1.Storage.checkDataBaseName(name);

                                if (!err) {
                                    _context35.next = 3;
                                    break;
                                }

                                return _context35.abrupt("return", { err: err });

                            case 3:
                                if (util_1.isUndefined(this.m_root[name])) {
                                    this.m_root[name] = (0, _create2.default)(null);
                                }
                                _context35.next = 6;
                                return this.getReadWritableDatabase(name);

                            case 6:
                                return _context35.abrupt("return", _context35.sent);

                            case 7:
                            case "end":
                                return _context35.stop();
                        }
                    }
                }, _callee35, this);
            }));

            function createDatabase(_x52) {
                return _ref36.apply(this, arguments);
            }

            return createDatabase;
        }()
    }, {
        key: "getReadWritableDatabase",
        value: function () {
            var _ref37 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee36(name) {
                var err;
                return _regenerator2.default.wrap(function _callee36$(_context36) {
                    while (1) {
                        switch (_context36.prev = _context36.next) {
                            case 0:
                                err = storage_1.Storage.checkDataBaseName(name);

                                if (!err) {
                                    _context36.next = 3;
                                    break;
                                }

                                return _context36.abrupt("return", { err: err });

                            case 3:
                                return _context36.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: new JsonDataBase(this.m_root, name, this.m_logger) });

                            case 4:
                            case "end":
                                return _context36.stop();
                        }
                    }
                }, _callee36, this);
            }));

            function getReadWritableDatabase(_x53) {
                return _ref37.apply(this, arguments);
            }

            return getReadWritableDatabase;
        }()
    }, {
        key: "beginTransaction",
        value: function () {
            var _ref38 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee37() {
                var transcation;
                return _regenerator2.default.wrap(function _callee37$(_context37) {
                    while (1) {
                        switch (_context37.prev = _context37.next) {
                            case 0:
                                transcation = new JsonStorageTransaction(this.m_root);
                                _context37.next = 3;
                                return transcation.beginTransaction();

                            case 3:
                                return _context37.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: transcation });

                            case 4:
                            case "end":
                                return _context37.stop();
                        }
                    }
                }, _callee37, this);
            }));

            function beginTransaction() {
                return _ref38.apply(this, arguments);
            }

            return beginTransaction;
        }()
    }, {
        key: "flush",
        value: function () {
            var _ref39 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee38(root) {
                return _regenerator2.default.wrap(function _callee38$(_context38) {
                    while (1) {
                        switch (_context38.prev = _context38.next) {
                            case 0:
                                this.m_root = root;
                                _context38.next = 3;
                                return fs.writeJSON(this.m_filePath, this.m_root);

                            case 3:
                            case "end":
                                return _context38.stop();
                        }
                    }
                }, _callee38, this);
            }));

            function flush(_x54) {
                return _ref39.apply(this, arguments);
            }

            return flush;
        }()
    }, {
        key: "root",
        get: function get() {
            var r = this.m_root;
            return r;
        }
    }, {
        key: "isInit",
        get: function get() {
            return this.m_isInit;
        }
    }]);
    return JsonStorage;
}(storage_1.Storage);

exports.JsonStorage = JsonStorage;