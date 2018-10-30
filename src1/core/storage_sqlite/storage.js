"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _setImmediate2 = require("babel-runtime/core-js/set-immediate");

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var assert = require("assert");
var sqlite = require("sqlite");
var sqlite3 = require("sqlite3");

var _require = require('sqlite3-transactions'),
    TransactionDatabase = _require.TransactionDatabase;

var error_code_1 = require("../error_code");
var serializable_1 = require("../serializable");
var storage_1 = require("../storage");
var util_1 = require("util");

var _require2 = require('../lib/log_shim'),
    LogShim = _require2.LogShim;

var SqliteStorageKeyValue = function () {
    function SqliteStorageKeyValue(db, fullName, logger) {
        (0, _classCallCheck3.default)(this, SqliteStorageKeyValue);

        this.db = db;
        this.fullName = fullName;
        this.logger = new LogShim(logger).bind("[transaction: " + this.fullName + "]", true).log;
    }

    (0, _createClass3.default)(SqliteStorageKeyValue, [{
        key: "set",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(key, value) {
                var json, sql;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;

                                assert(key);
                                json = (0, _stringify2.default)(serializable_1.toStringifiable(value, true));
                                sql = "REPLACE INTO '" + this.fullName + "' (name, field, value) VALUES ('" + key + "', \"____default____\", '" + json + "')";
                                _context.next = 6;
                                return this.db.exec(sql);

                            case 6:
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 9:
                                _context.prev = 9;
                                _context.t0 = _context["catch"](0);

                                this.logger.error("set " + key + " ", _context.t0);
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 13:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 9]]);
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
                var result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;

                                assert(key);
                                _context2.next = 4;
                                return this.db.get("SELECT value FROM '" + this.fullName + "'                 WHERE name=? AND field=\"____default____\"", key);

                            case 4:
                                result = _context2.sent;

                                if (!(result == null)) {
                                    _context2.next = 7;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 7:
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.fromStringifiable(JSON.parse(result.value)) });

                            case 10:
                                _context2.prev = 10;
                                _context2.t0 = _context2["catch"](0);

                                this.logger.error("get " + key + " ", _context2.t0);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 14:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 10]]);
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
                var json, sql;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;

                                assert(key);
                                assert(field);
                                json = (0, _stringify2.default)(serializable_1.toStringifiable(value, true));
                                sql = "REPLACE INTO '" + this.fullName + "' (name, field, value) VALUES ('" + key + "', '" + field + "', '" + json + "')";
                                _context3.next = 7;
                                return this.db.exec(sql);

                            case 7:
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 10:
                                _context3.prev = 10;
                                _context3.t0 = _context3["catch"](0);

                                this.logger.error("hset " + key + " " + field + " ", _context3.t0);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 14:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0, 10]]);
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
                var result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;

                                assert(key);
                                assert(field);
                                _context4.next = 5;
                                return this.db.get("SELECT value FROM '" + this.fullName + "' WHERE name=? AND field=?", key, field);

                            case 5:
                                result = _context4.sent;

                                if (!(result == null)) {
                                    _context4.next = 8;
                                    break;
                                }

                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 8:
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: serializable_1.fromStringifiable(JSON.parse(result.value)) });

                            case 11:
                                _context4.prev = 11;
                                _context4.t0 = _context4["catch"](0);

                                this.logger.error("hget " + key + " " + field + " ", _context4.t0);
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 15:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 11]]);
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
                                _context5.next = 3;
                                return this.db.exec("DELETE FROM '" + this.fullName + "' WHERE name='" + key + "' and field='" + field + "'");

                            case 3:
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 6:
                                _context5.prev = 6;
                                _context5.t0 = _context5["catch"](0);

                                this.logger.error("hdel " + key + " " + field + " ", _context5.t0);
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 10:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 6]]);
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
                var result;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.prev = 0;

                                assert(key);
                                _context6.next = 4;
                                return this.db.get("SELECT count(*) as value FROM '" + this.fullName + "' WHERE name=?", key);

                            case 4:
                                result = _context6.sent;
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: result.value });

                            case 8:
                                _context6.prev = 8;
                                _context6.t0 = _context6["catch"](0);

                                this.logger.error("hlen " + key + " ", _context6.t0);
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 12:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[0, 8]]);
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
                var _ref8, err;

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.hget(key, field);

                            case 2:
                                _ref8 = _context7.sent;
                                err = _ref8.err;

                                if (err) {
                                    _context7.next = 8;
                                    break;
                                }

                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: true });

                            case 8:
                                if (!(err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context7.next = 12;
                                    break;
                                }

                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: false });

                            case 12:
                                this.logger.error("hexists " + key + " " + field + " ", err);
                                return _context7.abrupt("return", { err: err });

                            case 14:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function hexists(_x12, _x13) {
                return _ref7.apply(this, arguments);
            }

            return hexists;
        }()
    }, {
        key: "hmset",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(key, fields, values) {
                var statement, i;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;

                                assert(key);
                                assert(fields.length === values.length);
                                _context8.next = 5;
                                return this.db.prepare("REPLACE INTO '" + this.fullName + "'  (name, field, value) VALUES (?, ?, ?)");

                            case 5:
                                statement = _context8.sent;
                                i = 0;

                            case 7:
                                if (!(i < fields.length)) {
                                    _context8.next = 13;
                                    break;
                                }

                                _context8.next = 10;
                                return statement.run([key, fields[i], (0, _stringify2.default)(serializable_1.toStringifiable(values[i], true))]);

                            case 10:
                                i++;
                                _context8.next = 7;
                                break;

                            case 13:
                                _context8.next = 15;
                                return statement.finalize();

                            case 15:
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 18:
                                _context8.prev = 18;
                                _context8.t0 = _context8["catch"](0);

                                this.logger.error("hmset " + key + " " + fields + " ", _context8.t0);
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 22:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 18]]);
            }));

            function hmset(_x14, _x15, _x16) {
                return _ref9.apply(this, arguments);
            }

            return hmset;
        }()
    }, {
        key: "hmget",
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(key, fields) {
                var _db, sql, result, resultMap, values;

                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;

                                assert(key);
                                sql = "SELECT * FROM '" + this.fullName + "' WHERE name=? AND field in (" + fields.map(function (x) {
                                    return '?';
                                }).join(',') + ")";
                                // console.log({ sql });

                                _context9.next = 5;
                                return (_db = this.db).all.apply(_db, [sql, key].concat((0, _toConsumableArray3.default)(fields)));

                            case 5:
                                result = _context9.sent;
                                resultMap = {};

                                result.forEach(function (x) {
                                    return resultMap[x.field] = serializable_1.fromStringifiable(JSON.parse(x.value));
                                });
                                values = fields.map(function (x) {
                                    return resultMap[x];
                                });
                                return _context9.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: values });

                            case 12:
                                _context9.prev = 12;
                                _context9.t0 = _context9["catch"](0);

                                this.logger.error("hmget " + key + " " + fields + " ", _context9.t0);
                                return _context9.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 16:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 12]]);
            }));

            function hmget(_x17, _x18) {
                return _ref10.apply(this, arguments);
            }

            return hmget;
        }()
    }, {
        key: "hkeys",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(key) {
                var result;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.prev = 0;

                                assert(key);
                                _context10.next = 4;
                                return this.db.all("SELECT * FROM '" + this.fullName + "' WHERE name=?", key);

                            case 4:
                                result = _context10.sent;
                                return _context10.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: result.map(function (x) {
                                        return x.field;
                                    }) });

                            case 8:
                                _context10.prev = 8;
                                _context10.t0 = _context10["catch"](0);

                                this.logger.error("hkeys " + key + " ", _context10.t0);
                                return _context10.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 12:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[0, 8]]);
            }));

            function hkeys(_x19) {
                return _ref11.apply(this, arguments);
            }

            return hkeys;
        }()
    }, {
        key: "hvalues",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(key) {
                var result;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.prev = 0;

                                assert(key);
                                _context11.next = 4;
                                return this.db.all("SELECT * FROM '" + this.fullName + "' WHERE name=?", key);

                            case 4:
                                result = _context11.sent;
                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: result.map(function (x) {
                                        return serializable_1.fromStringifiable(JSON.parse(x.value));
                                    }) });

                            case 8:
                                _context11.prev = 8;
                                _context11.t0 = _context11["catch"](0);

                                this.logger.error("hvalues " + key + " ", _context11.t0);
                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 12:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[0, 8]]);
            }));

            function hvalues(_x20) {
                return _ref12.apply(this, arguments);
            }

            return hvalues;
        }()
    }, {
        key: "hgetall",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(key) {
                var result;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.prev = 0;
                                _context12.next = 3;
                                return this.db.all("SELECT * FROM '" + this.fullName + "' WHERE name=?", key);

                            case 3:
                                result = _context12.sent;
                                return _context12.abrupt("return", {
                                    err: error_code_1.ErrorCode.RESULT_OK, value: result.map(function (x) {
                                        return { key: x.field, value: serializable_1.fromStringifiable(JSON.parse(x.value)) };
                                    })
                                });

                            case 7:
                                _context12.prev = 7;
                                _context12.t0 = _context12["catch"](0);

                                this.logger.error("hgetall " + key + " ", _context12.t0);
                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[0, 7]]);
            }));

            function hgetall(_x21) {
                return _ref13.apply(this, arguments);
            }

            return hgetall;
        }()
    }, {
        key: "hclean",
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(key) {
                var result;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.prev = 0;
                                _context13.next = 3;
                                return this.db.exec("DELETE FROM " + this.fullName + " WHERE name='" + key + "'");

                            case 3:
                                result = _context13.sent;
                                return _context13.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 7:
                                _context13.prev = 7;
                                _context13.t0 = _context13["catch"](0);

                                this.logger.error("hclean " + key + " ", _context13.t0);
                                return _context13.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this, [[0, 7]]);
            }));

            function hclean(_x22) {
                return _ref14.apply(this, arguments);
            }

            return hclean;
        }()
    }, {
        key: "lindex",
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(key, index) {
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                return _context14.abrupt("return", this.hget(key, index.toString()));

                            case 1:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function lindex(_x23, _x24) {
                return _ref15.apply(this, arguments);
            }

            return lindex;
        }()
    }, {
        key: "lset",
        value: function () {
            var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(key, index, value) {
                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.prev = 0;

                                assert(key);
                                _context15.next = 4;
                                return this.hset(key, index.toString(), value);

                            case 4:
                                return _context15.abrupt("return", _context15.sent);

                            case 7:
                                _context15.prev = 7;
                                _context15.t0 = _context15["catch"](0);

                                this.logger.error("lset " + key + " " + index + " ", _context15.t0);
                                return _context15.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                            case "end":
                                return _context15.stop();
                        }
                    }
                }, _callee15, this, [[0, 7]]);
            }));

            function lset(_x25, _x26, _x27) {
                return _ref16.apply(this, arguments);
            }

            return lset;
        }()
    }, {
        key: "llen",
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(key) {
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.next = 2;
                                return this.hlen(key);

                            case 2:
                                return _context16.abrupt("return", _context16.sent);

                            case 3:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function llen(_x28) {
                return _ref17.apply(this, arguments);
            }

            return llen;
        }()
    }, {
        key: "lrange",
        value: function () {
            var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(key, start, stop) {
                var _ref19, err, len, fields, i, result, ret, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;

                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.prev = 0;

                                assert(key);
                                _context17.next = 4;
                                return this.llen(key);

                            case 4:
                                _ref19 = _context17.sent;
                                err = _ref19.err;
                                len = _ref19.value;

                                if (!err) {
                                    _context17.next = 9;
                                    break;
                                }

                                return _context17.abrupt("return", { err: err });

                            case 9:
                                if (len) {
                                    _context17.next = 11;
                                    break;
                                }

                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: [] });

                            case 11:
                                if (start < 0) {
                                    start = len + start;
                                }
                                if (stop < 0) {
                                    stop = len + stop;
                                }
                                if (stop >= len) {
                                    stop = len - 1;
                                }
                                fields = [];

                                for (i = start; i <= stop; ++i) {
                                    fields.push(i);
                                }
                                _context17.next = 18;
                                return this.db.all("SELECT * FROM '" + this.fullName + "' WHERE name='" + key + "' AND field in (" + fields.map(function (x) {
                                    return "'" + x + "'";
                                }).join(',') + ")");

                            case 18:
                                result = _context17.sent;
                                ret = new Array(result.length);
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context17.prev = 23;

                                for (_iterator = (0, _getIterator3.default)(result); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    x = _step.value;

                                    ret[parseInt(x.field) - start] = serializable_1.fromStringifiable(JSON.parse(x.value));
                                }
                                _context17.next = 31;
                                break;

                            case 27:
                                _context17.prev = 27;
                                _context17.t0 = _context17["catch"](23);
                                _didIteratorError = true;
                                _iteratorError = _context17.t0;

                            case 31:
                                _context17.prev = 31;
                                _context17.prev = 32;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 34:
                                _context17.prev = 34;

                                if (!_didIteratorError) {
                                    _context17.next = 37;
                                    break;
                                }

                                throw _iteratorError;

                            case 37:
                                return _context17.finish(34);

                            case 38:
                                return _context17.finish(31);

                            case 39:
                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: ret });

                            case 42:
                                _context17.prev = 42;
                                _context17.t1 = _context17["catch"](0);

                                this.logger.error("lrange " + key + " " + start + " " + stop, _context17.t1);
                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 46:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this, [[0, 42], [23, 27, 31, 39], [32,, 34, 38]]);
            }));

            function lrange(_x29, _x30, _x31) {
                return _ref18.apply(this, arguments);
            }

            return lrange;
        }()
    }, {
        key: "lpush",
        value: function () {
            var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(key, value) {
                var json, sql;
                return _regenerator2.default.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _context18.prev = 0;

                                assert(key);
                                // update index += 1
                                // set index[0] = value
                                json = (0, _stringify2.default)(serializable_1.toStringifiable(value, true));
                                _context18.next = 5;
                                return this.db.exec("UPDATE '" + this.fullName + "' SET field=field+1 WHERE name='" + key + "'");

                            case 5:
                                sql = "INSERT INTO '" + this.fullName + "' (name, field, value) VALUES ('" + key + "', '0', '" + json + "')";
                                // console.log('lpush', { sql });

                                _context18.next = 8;
                                return this.db.exec(sql);

                            case 8:
                                return _context18.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 11:
                                _context18.prev = 11;
                                _context18.t0 = _context18["catch"](0);

                                this.logger.error("lpush " + key + " ", _context18.t0);
                                return _context18.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 15:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this, [[0, 11]]);
            }));

            function lpush(_x32, _x33) {
                return _ref20.apply(this, arguments);
            }

            return lpush;
        }()
    }, {
        key: "lpushx",
        value: function () {
            var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(key, value) {
                var len, i, json;
                return _regenerator2.default.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.prev = 0;

                                assert(key);
                                len = value.length;
                                _context19.next = 5;
                                return this.db.exec("UPDATE '" + this.fullName + "' SET field=field+" + len + " WHERE name='" + key + "'");

                            case 5:
                                i = 0;

                            case 6:
                                if (!(i < len)) {
                                    _context19.next = 13;
                                    break;
                                }

                                json = (0, _stringify2.default)(serializable_1.toStringifiable(value[i], true));
                                _context19.next = 10;
                                return this.db.exec("INSERT INTO '" + this.fullName + "' (name, field, value) VALUES ('" + key + "', '" + i + "', '" + json + "')");

                            case 10:
                                i++;
                                _context19.next = 6;
                                break;

                            case 13:
                                return _context19.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 16:
                                _context19.prev = 16;
                                _context19.t0 = _context19["catch"](0);

                                this.logger.error("lpushx " + key + " ", _context19.t0);
                                return _context19.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 20:
                            case "end":
                                return _context19.stop();
                        }
                    }
                }, _callee19, this, [[0, 16]]);
            }));

            function lpushx(_x34, _x35) {
                return _ref21.apply(this, arguments);
            }

            return lpushx;
        }()
    }, {
        key: "lpop",
        value: function () {
            var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(key) {
                return _regenerator2.default.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                return _context20.abrupt("return", this.lremove(key, 0));

                            case 1:
                            case "end":
                                return _context20.stop();
                        }
                    }
                }, _callee20, this);
            }));

            function lpop(_x36) {
                return _ref22.apply(this, arguments);
            }

            return lpop;
        }()
    }, {
        key: "rpush",
        value: function () {
            var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(key, value) {
                var _ref24, err, len, json;

                return _regenerator2.default.wrap(function _callee21$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:
                                _context21.prev = 0;

                                assert(key);
                                _context21.next = 4;
                                return this.llen(key);

                            case 4:
                                _ref24 = _context21.sent;
                                err = _ref24.err;
                                len = _ref24.value;

                                if (!err) {
                                    _context21.next = 9;
                                    break;
                                }

                                return _context21.abrupt("return", { err: err });

                            case 9:
                                json = (0, _stringify2.default)(serializable_1.toStringifiable(value, true));
                                _context21.next = 12;
                                return this.db.exec("INSERT INTO '" + this.fullName + "' (name, field, value) VALUES ('" + key + "', '" + len + "', '" + json + "')");

                            case 12:
                                return _context21.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 15:
                                _context21.prev = 15;
                                _context21.t0 = _context21["catch"](0);

                                this.logger.error("rpush " + key + " ", _context21.t0);
                                return _context21.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 19:
                            case "end":
                                return _context21.stop();
                        }
                    }
                }, _callee21, this, [[0, 15]]);
            }));

            function rpush(_x37, _x38) {
                return _ref23.apply(this, arguments);
            }

            return rpush;
        }()
    }, {
        key: "rpushx",
        value: function () {
            var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22(key, value) {
                var _ref26, err, len, i, json;

                return _regenerator2.default.wrap(function _callee22$(_context22) {
                    while (1) {
                        switch (_context22.prev = _context22.next) {
                            case 0:
                                _context22.prev = 0;

                                assert(key);
                                _context22.next = 4;
                                return this.llen(key);

                            case 4:
                                _ref26 = _context22.sent;
                                err = _ref26.err;
                                len = _ref26.value;

                                if (!err) {
                                    _context22.next = 9;
                                    break;
                                }

                                return _context22.abrupt("return", { err: err });

                            case 9:
                                i = 0;

                            case 10:
                                if (!(i < value.length)) {
                                    _context22.next = 17;
                                    break;
                                }

                                json = (0, _stringify2.default)(serializable_1.toStringifiable(value[i], true));
                                _context22.next = 14;
                                return this.db.exec("INSERT INTO '" + this.fullName + "' (name, field, value)                     VALUES ('" + key + "', '" + (len + i) + "', '" + json + "')");

                            case 14:
                                i++;
                                _context22.next = 10;
                                break;

                            case 17:
                                return _context22.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 20:
                                _context22.prev = 20;
                                _context22.t0 = _context22["catch"](0);

                                this.logger.error("rpushx " + key + " ", _context22.t0);
                                return _context22.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 24:
                            case "end":
                                return _context22.stop();
                        }
                    }
                }, _callee22, this, [[0, 20]]);
            }));

            function rpushx(_x39, _x40) {
                return _ref25.apply(this, arguments);
            }

            return rpushx;
        }()
    }, {
        key: "rpop",
        value: function () {
            var _ref27 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23(key) {
                var _ref28, err, len, _ref29, err2, value;

                return _regenerator2.default.wrap(function _callee23$(_context23) {
                    while (1) {
                        switch (_context23.prev = _context23.next) {
                            case 0:
                                _context23.prev = 0;

                                assert(key);
                                _context23.next = 4;
                                return this.llen(key);

                            case 4:
                                _ref28 = _context23.sent;
                                err = _ref28.err;
                                len = _ref28.value;

                                if (!err) {
                                    _context23.next = 9;
                                    break;
                                }

                                return _context23.abrupt("return", { err: err });

                            case 9:
                                if (!(len === 0)) {
                                    _context23.next = 13;
                                    break;
                                }

                                return _context23.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 13:
                                _context23.next = 15;
                                return this.lindex(key, len - 1);

                            case 15:
                                _ref29 = _context23.sent;
                                err2 = _ref29.err;
                                value = _ref29.value;
                                _context23.next = 20;
                                return this.db.exec("DELETE FROM '" + this.fullName + "' WHERE name='" + key + "' AND field=" + (len - 1));

                            case 20:
                                return _context23.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: value });

                            case 21:
                                _context23.next = 27;
                                break;

                            case 23:
                                _context23.prev = 23;
                                _context23.t0 = _context23["catch"](0);

                                this.logger.error("rpop " + key + " ", _context23.t0);
                                return _context23.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 27:
                            case "end":
                                return _context23.stop();
                        }
                    }
                }, _callee23, this, [[0, 23]]);
            }));

            function rpop(_x41) {
                return _ref27.apply(this, arguments);
            }

            return rpop;
        }()
    }, {
        key: "linsert",
        value: function () {
            var _ref30 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(key, index, value) {
                var _ref31, err, len, i;

                return _regenerator2.default.wrap(function _callee24$(_context24) {
                    while (1) {
                        switch (_context24.prev = _context24.next) {
                            case 0:
                                _context24.prev = 0;

                                assert(key);
                                _context24.next = 4;
                                return this.llen(key);

                            case 4:
                                _ref31 = _context24.sent;
                                err = _ref31.err;
                                len = _ref31.value;

                                if (!err) {
                                    _context24.next = 9;
                                    break;
                                }

                                return _context24.abrupt("return", { err: err });

                            case 9:
                                if (!(len === 0 || index >= len)) {
                                    _context24.next = 15;
                                    break;
                                }

                                _context24.next = 12;
                                return this.lset(key, len, value);

                            case 12:
                                return _context24.abrupt("return", _context24.sent);

                            case 15:
                                i = len - 1;

                            case 16:
                                if (!(i >= index)) {
                                    _context24.next = 22;
                                    break;
                                }

                                _context24.next = 19;
                                return this.db.exec("UPDATE '" + this.fullName + "' SET field=field+1 WHERE name='" + key + "' AND field = " + i);

                            case 19:
                                i--;
                                _context24.next = 16;
                                break;

                            case 22:
                                _context24.next = 24;
                                return this.lset(key, index, value);

                            case 24:
                                return _context24.abrupt("return", _context24.sent);

                            case 25:
                                _context24.next = 31;
                                break;

                            case 27:
                                _context24.prev = 27;
                                _context24.t0 = _context24["catch"](0);

                                this.logger.error("linsert " + key + " " + index + " ", _context24.t0);
                                return _context24.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 31:
                            case "end":
                                return _context24.stop();
                        }
                    }
                }, _callee24, this, [[0, 27]]);
            }));

            function linsert(_x42, _x43, _x44) {
                return _ref30.apply(this, arguments);
            }

            return linsert;
        }()
    }, {
        key: "lremove",
        value: function () {
            var _ref32 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25(key, index) {
                var _ref33, err, len, _ref34, err2, value, sql, i;

                return _regenerator2.default.wrap(function _callee25$(_context25) {
                    while (1) {
                        switch (_context25.prev = _context25.next) {
                            case 0:
                                _context25.prev = 0;

                                assert(key);
                                _context25.next = 4;
                                return this.llen(key);

                            case 4:
                                _ref33 = _context25.sent;
                                err = _ref33.err;
                                len = _ref33.value;

                                if (!err) {
                                    _context25.next = 9;
                                    break;
                                }

                                return _context25.abrupt("return", { err: err });

                            case 9:
                                if (!(len === 0)) {
                                    _context25.next = 13;
                                    break;
                                }

                                return _context25.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 13:
                                _context25.next = 15;
                                return this.lindex(key, index);

                            case 15:
                                _ref34 = _context25.sent;
                                err2 = _ref34.err;
                                value = _ref34.value;
                                sql = "DELETE FROM '" + this.fullName + "' WHERE name='" + key + "' AND field='" + index + "'";
                                // console.log('lremove', { sql });

                                _context25.next = 21;
                                return this.db.exec(sql);

                            case 21:
                                i = index + 1;

                            case 22:
                                if (!(i < len)) {
                                    _context25.next = 29;
                                    break;
                                }

                                sql = "UPDATE '" + this.fullName + "' SET field=field-1 WHERE name='" + key + "' AND field = " + i;
                                // console.log({ sql });
                                _context25.next = 26;
                                return this.db.exec(sql);

                            case 26:
                                i++;
                                _context25.next = 22;
                                break;

                            case 29:
                                return _context25.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: value });

                            case 30:
                                _context25.next = 36;
                                break;

                            case 32:
                                _context25.prev = 32;
                                _context25.t0 = _context25["catch"](0);

                                this.logger.error("lremove " + key + " ", _context25.t0);
                                return _context25.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 36:
                            case "end":
                                return _context25.stop();
                        }
                    }
                }, _callee25, this, [[0, 32]]);
            }));

            function lremove(_x45, _x46) {
                return _ref32.apply(this, arguments);
            }

            return lremove;
        }()
    }]);
    return SqliteStorageKeyValue;
}();

var SqliteStorageTransaction = function () {
    function SqliteStorageTransaction(db) {
        (0, _classCallCheck3.default)(this, SqliteStorageTransaction);

        this.m_transcationDB = new TransactionDatabase(db.driver);
    }

    (0, _createClass3.default)(SqliteStorageTransaction, [{
        key: "beginTransaction",
        value: function beginTransaction() {
            var _this = this;

            return new _promise2.default(function (resolve, reject) {
                _this.m_transcationDB.beginTransaction(function (err, transcation) {
                    if (err) {
                        reject(err);
                    } else {
                        _this.m_transcation = transcation;
                        resolve(error_code_1.ErrorCode.RESULT_OK);
                    }
                });
            });
        }
    }, {
        key: "commit",
        value: function commit() {
            var _this2 = this;

            return new _promise2.default(function (resolve, reject) {
                _this2.m_transcation.commit(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(error_code_1.ErrorCode.RESULT_OK);
                    }
                });
            });
        }
    }, {
        key: "rollback",
        value: function rollback() {
            var _this3 = this;

            return new _promise2.default(function (resolve, reject) {
                _this3.m_transcation.rollback(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(error_code_1.ErrorCode.RESULT_OK);
                    }
                });
            });
        }
    }]);
    return SqliteStorageTransaction;
}();

var SqliteDataBase = function () {
    function SqliteDataBase(name, db, logger) {
        (0, _classCallCheck3.default)(this, SqliteDataBase);

        this.name = name;
        this.logger = logger;
        this.m_db = db;
    }

    (0, _createClass3.default)(SqliteDataBase, [{
        key: "getReadableKeyValue",
        value: function () {
            var _ref35 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26(name) {
                var fullName, tbl;
                return _regenerator2.default.wrap(function _callee26$(_context26) {
                    while (1) {
                        switch (_context26.prev = _context26.next) {
                            case 0:
                                fullName = storage_1.Storage.getKeyValueFullName(this.name, name);
                                tbl = new SqliteStorageKeyValue(this.m_db, fullName, this.logger);
                                return _context26.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, kv: tbl });

                            case 3:
                            case "end":
                                return _context26.stop();
                        }
                    }
                }, _callee26, this);
            }));

            function getReadableKeyValue(_x47) {
                return _ref35.apply(this, arguments);
            }

            return getReadableKeyValue;
        }()
    }, {
        key: "createKeyValue",
        value: function () {
            var _ref36 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27(name) {
                var err, fullName, ret, tbl;
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
                                fullName = storage_1.Storage.getKeyValueFullName(this.name, name);
                                // 先判断表是否存在

                                _context27.next = 6;
                                return this.m_db.get("SELECT COUNT(*) FROM sqlite_master where type='table' and name='" + fullName + "'");

                            case 6:
                                ret = _context27.sent;

                                if (!(ret[0] > 0)) {
                                    _context27.next = 11;
                                    break;
                                }

                                err = error_code_1.ErrorCode.RESULT_ALREADY_EXIST;
                                _context27.next = 14;
                                break;

                            case 11:
                                err = error_code_1.ErrorCode.RESULT_OK;
                                _context27.next = 14;
                                return this.m_db.exec("CREATE TABLE IF NOT EXISTS  '" + fullName + "'            (name TEXT, field TEXT, value TEXT, unique(name, field))");

                            case 14:
                                tbl = new SqliteStorageKeyValue(this.m_db, fullName, this.logger);
                                return _context27.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, kv: tbl });

                            case 16:
                            case "end":
                                return _context27.stop();
                        }
                    }
                }, _callee27, this);
            }));

            function createKeyValue(_x48) {
                return _ref36.apply(this, arguments);
            }

            return createKeyValue;
        }()
    }, {
        key: "getReadWritableKeyValue",
        value: function () {
            var _ref37 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28(name) {
                var tbl;
                return _regenerator2.default.wrap(function _callee28$(_context28) {
                    while (1) {
                        switch (_context28.prev = _context28.next) {
                            case 0:
                                tbl = new SqliteStorageKeyValue(this.m_db, storage_1.Storage.getKeyValueFullName(this.name, name), this.logger);
                                return _context28.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, kv: tbl });

                            case 2:
                            case "end":
                                return _context28.stop();
                        }
                    }
                }, _callee28, this);
            }));

            function getReadWritableKeyValue(_x49) {
                return _ref37.apply(this, arguments);
            }

            return getReadWritableKeyValue;
        }()
    }]);
    return SqliteDataBase;
}();

var SqliteStorage = function (_storage_1$Storage) {
    (0, _inherits3.default)(SqliteStorage, _storage_1$Storage);

    function SqliteStorage() {
        (0, _classCallCheck3.default)(this, SqliteStorage);

        var _this4 = (0, _possibleConstructorReturn3.default)(this, (SqliteStorage.__proto__ || (0, _getPrototypeOf2.default)(SqliteStorage)).apply(this, arguments));

        _this4.m_isInit = false;
        return _this4;
    }

    (0, _createClass3.default)(SqliteStorage, [{
        key: "_createLogger",
        value: function _createLogger() {
            return new storage_1.JStorageLogger();
        }
    }, {
        key: "init",
        value: function () {
            var _ref38 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29(readonly) {
                var _this5 = this;

                var options, err;
                return _regenerator2.default.wrap(function _callee29$(_context29) {
                    while (1) {
                        switch (_context29.prev = _context29.next) {
                            case 0:
                                if (!this.m_db) {
                                    _context29.next = 2;
                                    break;
                                }

                                return _context29.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 2:
                                assert(!this.m_db);
                                fs.ensureDirSync(path.dirname(this.m_filePath));
                                options = {};

                                if (!readonly) {
                                    options.mode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
                                } else {
                                    options.mode = sqlite3.OPEN_READONLY;
                                }
                                err = error_code_1.ErrorCode.RESULT_OK;
                                _context29.prev = 7;
                                _context29.next = 10;
                                return sqlite.open(this.m_filePath, options);

                            case 10:
                                this.m_db = _context29.sent;
                                _context29.next = 16;
                                break;

                            case 13:
                                _context29.prev = 13;
                                _context29.t0 = _context29["catch"](7);

                                err = error_code_1.ErrorCode.RESULT_EXCEPTION;

                            case 16:
                                // await this.m_db.migrate({ force: 'latest', migrationsPath: path.join(__dirname, 'migrations') });
                                if (!err) {
                                    this.m_isInit = true;
                                }
                                (0, _setImmediate3.default)(function () {
                                    _this5.m_eventEmitter.emit('init', err);
                                });
                                return _context29.abrupt("return", err);

                            case 19:
                            case "end":
                                return _context29.stop();
                        }
                    }
                }, _callee29, this, [[7, 13]]);
            }));

            function init(_x50) {
                return _ref38.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "uninit",
        value: function () {
            var _ref39 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30() {
                return _regenerator2.default.wrap(function _callee30$(_context30) {
                    while (1) {
                        switch (_context30.prev = _context30.next) {
                            case 0:
                                if (!this.m_db) {
                                    _context30.next = 4;
                                    break;
                                }

                                _context30.next = 3;
                                return this.m_db.close();

                            case 3:
                                delete this.m_db;

                            case 4:
                                return _context30.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 5:
                            case "end":
                                return _context30.stop();
                        }
                    }
                }, _callee30, this);
            }));

            function uninit() {
                return _ref39.apply(this, arguments);
            }

            return uninit;
        }()
    }, {
        key: "getReadableDataBase",
        value: function () {
            var _ref40 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee31(name) {
                var err;
                return _regenerator2.default.wrap(function _callee31$(_context31) {
                    while (1) {
                        switch (_context31.prev = _context31.next) {
                            case 0:
                                err = storage_1.Storage.checkDataBaseName(name);

                                if (!err) {
                                    _context31.next = 3;
                                    break;
                                }

                                return _context31.abrupt("return", { err: err });

                            case 3:
                                return _context31.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: new SqliteDataBase(name, this.m_db, this.m_logger) });

                            case 4:
                            case "end":
                                return _context31.stop();
                        }
                    }
                }, _callee31, this);
            }));

            function getReadableDataBase(_x51) {
                return _ref40.apply(this, arguments);
            }

            return getReadableDataBase;
        }()
    }, {
        key: "createDatabase",
        value: function () {
            var _ref41 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee32(name) {
                var err;
                return _regenerator2.default.wrap(function _callee32$(_context32) {
                    while (1) {
                        switch (_context32.prev = _context32.next) {
                            case 0:
                                err = storage_1.Storage.checkDataBaseName(name);

                                if (!err) {
                                    _context32.next = 3;
                                    break;
                                }

                                return _context32.abrupt("return", { err: err });

                            case 3:
                                _context32.next = 5;
                                return this.getReadWritableDatabase(name);

                            case 5:
                                return _context32.abrupt("return", _context32.sent);

                            case 6:
                            case "end":
                                return _context32.stop();
                        }
                    }
                }, _callee32, this);
            }));

            function createDatabase(_x52) {
                return _ref41.apply(this, arguments);
            }

            return createDatabase;
        }()
    }, {
        key: "getReadWritableDatabase",
        value: function () {
            var _ref42 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee33(name) {
                var err;
                return _regenerator2.default.wrap(function _callee33$(_context33) {
                    while (1) {
                        switch (_context33.prev = _context33.next) {
                            case 0:
                                err = storage_1.Storage.checkDataBaseName(name);

                                if (!err) {
                                    _context33.next = 3;
                                    break;
                                }

                                return _context33.abrupt("return", { err: err });

                            case 3:
                                return _context33.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: new SqliteDataBase(name, this.m_db, this.m_logger) });

                            case 4:
                            case "end":
                                return _context33.stop();
                        }
                    }
                }, _callee33, this);
            }));

            function getReadWritableDatabase(_x53) {
                return _ref42.apply(this, arguments);
            }

            return getReadWritableDatabase;
        }()
    }, {
        key: "beginTransaction",
        value: function () {
            var _ref43 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee34() {
                var transcation;
                return _regenerator2.default.wrap(function _callee34$(_context34) {
                    while (1) {
                        switch (_context34.prev = _context34.next) {
                            case 0:
                                assert(this.m_db);
                                transcation = new SqliteStorageTransaction(this.m_db);
                                _context34.next = 4;
                                return transcation.beginTransaction();

                            case 4:
                                return _context34.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: transcation });

                            case 5:
                            case "end":
                                return _context34.stop();
                        }
                    }
                }, _callee34, this);
            }));

            function beginTransaction() {
                return _ref43.apply(this, arguments);
            }

            return beginTransaction;
        }()
    }, {
        key: "toJsonStorage",
        value: function () {
            var _ref44 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee35(storage) {
                var tableNames, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _ref46, name, _SqliteStorage$splitF, dbName, kvName, root, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _step3$value, kvNames, dbRoot, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, kvRoot, tableName, elems, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, elem, index, arr, offset, ix;

                return _regenerator2.default.wrap(function _callee35$(_context35) {
                    while (1) {
                        switch (_context35.prev = _context35.next) {
                            case 0:
                                tableNames = new _map2.default();
                                _context35.prev = 1;
                                _context35.next = 4;
                                return this.m_db.all("select name fromsqlite_master where type='table' order by name;");

                            case 4:
                                results = _context35.sent;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context35.prev = 8;

                                for (_iterator2 = (0, _getIterator3.default)(results); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    _ref46 = _step2.value;
                                    name = _ref46.name;
                                    _SqliteStorage$splitF = SqliteStorage.splitFullName(name), dbName = _SqliteStorage$splitF.dbName, kvName = _SqliteStorage$splitF.kvName;

                                    if (!tableNames.has(dbName)) {
                                        tableNames.set(dbName, []);
                                    }
                                    tableNames.get(dbName).push(kvName);
                                }
                                _context35.next = 16;
                                break;

                            case 12:
                                _context35.prev = 12;
                                _context35.t0 = _context35["catch"](8);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context35.t0;

                            case 16:
                                _context35.prev = 16;
                                _context35.prev = 17;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 19:
                                _context35.prev = 19;

                                if (!_didIteratorError2) {
                                    _context35.next = 22;
                                    break;
                                }

                                throw _iteratorError2;

                            case 22:
                                return _context35.finish(19);

                            case 23:
                                return _context35.finish(16);

                            case 24:
                                _context35.next = 30;
                                break;

                            case 26:
                                _context35.prev = 26;
                                _context35.t1 = _context35["catch"](1);

                                this.m_logger.error("get all tables failed ", _context35.t1);
                                return _context35.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 30:
                                root = (0, _create2.default)(null);
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context35.prev = 34;
                                _iterator3 = (0, _getIterator3.default)(tableNames.entries());

                            case 36:
                                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                    _context35.next = 99;
                                    break;
                                }

                                _step3$value = (0, _slicedToArray3.default)(_step3.value, 2), dbName = _step3$value[0], kvNames = _step3$value[1];
                                dbRoot = (0, _create2.default)(null);

                                root[dbName] = dbRoot;
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context35.prev = 43;
                                _iterator4 = (0, _getIterator3.default)(kvNames);

                            case 45:
                                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                    _context35.next = 82;
                                    break;
                                }

                                kvName = _step4.value;
                                kvRoot = (0, _create2.default)(null);

                                dbRoot[kvName] = kvRoot;
                                tableName = SqliteStorage.getKeyValueFullName(dbName, kvName);
                                _context35.prev = 50;
                                _context35.next = 53;
                                return this.m_db.all("select * from " + tableName);

                            case 53:
                                elems = _context35.sent;
                                _iteratorNormalCompletion5 = true;
                                _didIteratorError5 = false;
                                _iteratorError5 = undefined;
                                _context35.prev = 57;

                                for (_iterator5 = (0, _getIterator3.default)(elems); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    elem = _step5.value;

                                    if (util_1.isUndefined(elem.field)) {
                                        kvRoot[elem.name] = serializable_1.fromStringifiable(JSON.parse(elem.value));
                                    } else {
                                        index = parseInt(elem.field);

                                        if (isNaN(index)) {
                                            if (util_1.isUndefined(kvRoot[elem.name])) {
                                                kvRoot[elem.name] = (0, _create2.default)(null);
                                            }
                                            kvRoot[elem.name][elem.filed] = serializable_1.fromStringifiable(JSON.parse(elem.value));
                                        } else {
                                            if (!util_1.isArray(kvRoot[elem.name])) {
                                                kvRoot[elem.name] = [];
                                            }
                                            arr = kvRoot[elem.name];

                                            if (arr.length > index) {
                                                arr[index] = serializable_1.fromStringifiable(JSON.parse(elem.value));
                                            } else {
                                                offset = index - arr.length - 1;

                                                for (ix = 0; ix < offset; ++ix) {
                                                    arr.push(undefined);
                                                }
                                                arr.push(serializable_1.fromStringifiable(JSON.parse(elem.value)));
                                            }
                                        }
                                    }
                                }
                                _context35.next = 65;
                                break;

                            case 61:
                                _context35.prev = 61;
                                _context35.t2 = _context35["catch"](57);
                                _didIteratorError5 = true;
                                _iteratorError5 = _context35.t2;

                            case 65:
                                _context35.prev = 65;
                                _context35.prev = 66;

                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }

                            case 68:
                                _context35.prev = 68;

                                if (!_didIteratorError5) {
                                    _context35.next = 71;
                                    break;
                                }

                                throw _iteratorError5;

                            case 71:
                                return _context35.finish(68);

                            case 72:
                                return _context35.finish(65);

                            case 73:
                                _context35.next = 79;
                                break;

                            case 75:
                                _context35.prev = 75;
                                _context35.t3 = _context35["catch"](50);

                                this.m_logger.error("database: " + dbName + " kv: " + kvName + " transfer error ", _context35.t3);
                                return _context35.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 79:
                                _iteratorNormalCompletion4 = true;
                                _context35.next = 45;
                                break;

                            case 82:
                                _context35.next = 88;
                                break;

                            case 84:
                                _context35.prev = 84;
                                _context35.t4 = _context35["catch"](43);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context35.t4;

                            case 88:
                                _context35.prev = 88;
                                _context35.prev = 89;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 91:
                                _context35.prev = 91;

                                if (!_didIteratorError4) {
                                    _context35.next = 94;
                                    break;
                                }

                                throw _iteratorError4;

                            case 94:
                                return _context35.finish(91);

                            case 95:
                                return _context35.finish(88);

                            case 96:
                                _iteratorNormalCompletion3 = true;
                                _context35.next = 36;
                                break;

                            case 99:
                                _context35.next = 105;
                                break;

                            case 101:
                                _context35.prev = 101;
                                _context35.t5 = _context35["catch"](34);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context35.t5;

                            case 105:
                                _context35.prev = 105;
                                _context35.prev = 106;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 108:
                                _context35.prev = 108;

                                if (!_didIteratorError3) {
                                    _context35.next = 111;
                                    break;
                                }

                                throw _iteratorError3;

                            case 111:
                                return _context35.finish(108);

                            case 112:
                                return _context35.finish(105);

                            case 113:
                                _context35.next = 115;
                                return storage.flush(root);

                            case 115:
                                return _context35.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 116:
                            case "end":
                                return _context35.stop();
                        }
                    }
                }, _callee35, this, [[1, 26], [8, 12, 16, 24], [17,, 19, 23], [34, 101, 105, 113], [43, 84, 88, 96], [50, 75], [57, 61, 65, 73], [66,, 68, 72], [89,, 91, 95], [106,, 108, 112]]);
            }));

            function toJsonStorage(_x54) {
                return _ref44.apply(this, arguments);
            }

            return toJsonStorage;
        }()
    }, {
        key: "isInit",
        get: function get() {
            return this.m_isInit;
        }
    }]);
    return SqliteStorage;
}(storage_1.Storage);

exports.SqliteStorage = SqliteStorage;