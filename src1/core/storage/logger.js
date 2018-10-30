"use strict";

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

var LoggedStorage = function () {
    function LoggedStorage(storage, logger) {
        (0, _classCallCheck3.default)(this, LoggedStorage);

        this.m_storage = storage;
        this.m_logger = logger;
        this.m_logger.init();
        this._wrapStorage();
    }

    (0, _createClass3.default)(LoggedStorage, [{
        key: "_wrapStorage",
        value: function _wrapStorage() {
            var _this = this;

            var storage = this.m_storage;
            {
                var proto = storage.beginTransaction;
                storage.beginTransaction = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                    var ltr, btr;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return _this.m_logger.beginTransaction();

                                case 2:
                                    ltr = _context.sent;
                                    _context.next = 5;
                                    return ltr.value.beginTransaction();

                                case 5:
                                    _context.next = 7;
                                    return proto.bind(storage)();

                                case 7:
                                    btr = _context.sent;

                                    _this._wrapTransaction(btr.value, ltr.value);
                                    return _context.abrupt("return", btr);

                                case 10:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                }));
            }
            {
                var _proto = storage.getReadWritableDatabase;
                storage.getReadWritableDatabase = function () {
                    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(name) {
                        var ltr, dbr;
                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        _context2.next = 2;
                                        return _this.m_logger.getReadWritableDatabase(name);

                                    case 2:
                                        ltr = _context2.sent;
                                        _context2.next = 5;
                                        return _proto.bind(storage)(name);

                                    case 5:
                                        dbr = _context2.sent;

                                        _this._wrapDatabase(dbr.value, ltr.value);
                                        return _context2.abrupt("return", dbr);

                                    case 8:
                                    case "end":
                                        return _context2.stop();
                                }
                            }
                        }, _callee2, _this);
                    }));

                    return function (_x) {
                        return _ref2.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto2 = storage.createDatabase;
                storage.createDatabase = function () {
                    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(name) {
                        var ltr, dbr;
                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                            while (1) {
                                switch (_context3.prev = _context3.next) {
                                    case 0:
                                        _context3.next = 2;
                                        return _this.m_logger.createDatabase(name);

                                    case 2:
                                        ltr = _context3.sent;
                                        _context3.next = 5;
                                        return _proto2.bind(storage)(name);

                                    case 5:
                                        dbr = _context3.sent;

                                        _this._wrapDatabase(dbr.value, ltr.value);
                                        return _context3.abrupt("return", dbr);

                                    case 8:
                                    case "end":
                                        return _context3.stop();
                                }
                            }
                        }, _callee3, _this);
                    }));

                    return function (_x2) {
                        return _ref3.apply(this, arguments);
                    };
                }();
            }
        }
    }, {
        key: "_wrapDatabase",
        value: function _wrapDatabase(database, logger) {
            var _this2 = this;

            {
                var proto = database.getReadWritableKeyValue;
                database.getReadWritableKeyValue = function () {
                    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(name) {
                        var ltr, btr;
                        return _regenerator2.default.wrap(function _callee4$(_context4) {
                            while (1) {
                                switch (_context4.prev = _context4.next) {
                                    case 0:
                                        _context4.next = 2;
                                        return logger.getReadWritableKeyValue(name);

                                    case 2:
                                        ltr = _context4.sent;
                                        _context4.next = 5;
                                        return proto.bind(database)(name);

                                    case 5:
                                        btr = _context4.sent;

                                        _this2._wrapKeyvalue(btr.kv, ltr.kv);
                                        return _context4.abrupt("return", btr);

                                    case 8:
                                    case "end":
                                        return _context4.stop();
                                }
                            }
                        }, _callee4, _this2);
                    }));

                    return function (_x3) {
                        return _ref4.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto3 = database.createKeyValue;
                database.createKeyValue = function () {
                    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(name) {
                        var ltr, btr;
                        return _regenerator2.default.wrap(function _callee5$(_context5) {
                            while (1) {
                                switch (_context5.prev = _context5.next) {
                                    case 0:
                                        _context5.next = 2;
                                        return logger.createKeyValue(name);

                                    case 2:
                                        ltr = _context5.sent;
                                        _context5.next = 5;
                                        return _proto3.bind(database)(name);

                                    case 5:
                                        btr = _context5.sent;

                                        _this2._wrapKeyvalue(btr.kv, ltr.kv);
                                        return _context5.abrupt("return", btr);

                                    case 8:
                                    case "end":
                                        return _context5.stop();
                                }
                            }
                        }, _callee5, _this2);
                    }));

                    return function (_x4) {
                        return _ref5.apply(this, arguments);
                    };
                }();
            }
        }
    }, {
        key: "_wrapTransaction",
        value: function _wrapTransaction(transaction, logger) {
            var _this3 = this;

            {
                var proto = transaction.commit;
                transaction.commit = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                    return _regenerator2.default.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    logger.commit();
                                    _context6.next = 3;
                                    return proto.bind(transaction)();

                                case 3:
                                    return _context6.abrupt("return", _context6.sent);

                                case 4:
                                case "end":
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, _this3);
                }));
            }
            {
                var _proto4 = transaction.rollback;
                transaction.rollback = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                    return _regenerator2.default.wrap(function _callee7$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    logger.rollback();
                                    _context7.next = 3;
                                    return _proto4.bind(transaction)();

                                case 3:
                                    return _context7.abrupt("return", _context7.sent);

                                case 4:
                                case "end":
                                    return _context7.stop();
                            }
                        }
                    }, _callee7, _this3);
                }));
            }
        }
    }, {
        key: "_wrapKeyvalue",
        value: function _wrapKeyvalue(kv, logger) {
            var _this4 = this;

            {
                var proto = kv.set;
                kv.set = function () {
                    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(key, value) {
                        return _regenerator2.default.wrap(function _callee8$(_context8) {
                            while (1) {
                                switch (_context8.prev = _context8.next) {
                                    case 0:
                                        _context8.next = 2;
                                        return logger.set(key, value);

                                    case 2:
                                        _context8.next = 4;
                                        return proto.bind(kv)(key, value);

                                    case 4:
                                        return _context8.abrupt("return", _context8.sent);

                                    case 5:
                                    case "end":
                                        return _context8.stop();
                                }
                            }
                        }, _callee8, _this4);
                    }));

                    return function (_x5, _x6) {
                        return _ref8.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto5 = kv.hset;
                kv.hset = function () {
                    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(key, field, value) {
                        return _regenerator2.default.wrap(function _callee9$(_context9) {
                            while (1) {
                                switch (_context9.prev = _context9.next) {
                                    case 0:
                                        _context9.next = 2;
                                        return logger.hset(key, field, value);

                                    case 2:
                                        _context9.next = 4;
                                        return _proto5.bind(kv)(key, field, value);

                                    case 4:
                                        return _context9.abrupt("return", _context9.sent);

                                    case 5:
                                    case "end":
                                        return _context9.stop();
                                }
                            }
                        }, _callee9, _this4);
                    }));

                    return function (_x7, _x8, _x9) {
                        return _ref9.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto6 = kv.hmset;
                kv.hmset = function () {
                    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(key, fields, values) {
                        return _regenerator2.default.wrap(function _callee10$(_context10) {
                            while (1) {
                                switch (_context10.prev = _context10.next) {
                                    case 0:
                                        _context10.next = 2;
                                        return logger.hmset(key, fields, values);

                                    case 2:
                                        _context10.next = 4;
                                        return _proto6.bind(kv)(key, fields, values);

                                    case 4:
                                        return _context10.abrupt("return", _context10.sent);

                                    case 5:
                                    case "end":
                                        return _context10.stop();
                                }
                            }
                        }, _callee10, _this4);
                    }));

                    return function (_x10, _x11, _x12) {
                        return _ref10.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto7 = kv.hclean;
                kv.hclean = function () {
                    var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(key) {
                        return _regenerator2.default.wrap(function _callee11$(_context11) {
                            while (1) {
                                switch (_context11.prev = _context11.next) {
                                    case 0:
                                        _context11.next = 2;
                                        return logger.hclean(key);

                                    case 2:
                                        _context11.next = 4;
                                        return _proto7.bind(kv)(key);

                                    case 4:
                                        return _context11.abrupt("return", _context11.sent);

                                    case 5:
                                    case "end":
                                        return _context11.stop();
                                }
                            }
                        }, _callee11, _this4);
                    }));

                    return function (_x13) {
                        return _ref11.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto8 = kv.lset;
                kv.lset = function () {
                    var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(key, index, value) {
                        return _regenerator2.default.wrap(function _callee12$(_context12) {
                            while (1) {
                                switch (_context12.prev = _context12.next) {
                                    case 0:
                                        _context12.next = 2;
                                        return logger.lset(key, index, value);

                                    case 2:
                                        _context12.next = 4;
                                        return _proto8.bind(kv)(key, index, value);

                                    case 4:
                                        return _context12.abrupt("return", _context12.sent);

                                    case 5:
                                    case "end":
                                        return _context12.stop();
                                }
                            }
                        }, _callee12, _this4);
                    }));

                    return function (_x14, _x15, _x16) {
                        return _ref12.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto9 = kv.lpush;
                kv.lpush = function () {
                    var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(key, value) {
                        return _regenerator2.default.wrap(function _callee13$(_context13) {
                            while (1) {
                                switch (_context13.prev = _context13.next) {
                                    case 0:
                                        _context13.next = 2;
                                        return logger.lpush(key, value);

                                    case 2:
                                        _context13.next = 4;
                                        return _proto9.bind(kv)(key, value);

                                    case 4:
                                        return _context13.abrupt("return", _context13.sent);

                                    case 5:
                                    case "end":
                                        return _context13.stop();
                                }
                            }
                        }, _callee13, _this4);
                    }));

                    return function (_x17, _x18) {
                        return _ref13.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto10 = kv.lpushx;
                kv.lpushx = function () {
                    var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(key, value) {
                        return _regenerator2.default.wrap(function _callee14$(_context14) {
                            while (1) {
                                switch (_context14.prev = _context14.next) {
                                    case 0:
                                        _context14.next = 2;
                                        return logger.lpushx(key, value);

                                    case 2:
                                        _context14.next = 4;
                                        return _proto10.bind(kv)(key, value);

                                    case 4:
                                        return _context14.abrupt("return", _context14.sent);

                                    case 5:
                                    case "end":
                                        return _context14.stop();
                                }
                            }
                        }, _callee14, _this4);
                    }));

                    return function (_x19, _x20) {
                        return _ref14.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto11 = kv.lpop;
                kv.lpop = function () {
                    var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(key) {
                        return _regenerator2.default.wrap(function _callee15$(_context15) {
                            while (1) {
                                switch (_context15.prev = _context15.next) {
                                    case 0:
                                        _context15.next = 2;
                                        return logger.lpop(key);

                                    case 2:
                                        _context15.next = 4;
                                        return _proto11.bind(kv)(key);

                                    case 4:
                                        return _context15.abrupt("return", _context15.sent);

                                    case 5:
                                    case "end":
                                        return _context15.stop();
                                }
                            }
                        }, _callee15, _this4);
                    }));

                    return function (_x21) {
                        return _ref15.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto12 = kv.rpush;
                kv.rpush = function () {
                    var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(key, value) {
                        return _regenerator2.default.wrap(function _callee16$(_context16) {
                            while (1) {
                                switch (_context16.prev = _context16.next) {
                                    case 0:
                                        _context16.next = 2;
                                        return logger.rpush(key, value);

                                    case 2:
                                        _context16.next = 4;
                                        return _proto12.bind(kv)(key, value);

                                    case 4:
                                        return _context16.abrupt("return", _context16.sent);

                                    case 5:
                                    case "end":
                                        return _context16.stop();
                                }
                            }
                        }, _callee16, _this4);
                    }));

                    return function (_x22, _x23) {
                        return _ref16.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto13 = kv.rpushx;
                kv.rpushx = function () {
                    var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(key, value) {
                        return _regenerator2.default.wrap(function _callee17$(_context17) {
                            while (1) {
                                switch (_context17.prev = _context17.next) {
                                    case 0:
                                        _context17.next = 2;
                                        return logger.rpushx(key, value);

                                    case 2:
                                        _context17.next = 4;
                                        return _proto13.bind(kv)(key, value);

                                    case 4:
                                        return _context17.abrupt("return", _context17.sent);

                                    case 5:
                                    case "end":
                                        return _context17.stop();
                                }
                            }
                        }, _callee17, _this4);
                    }));

                    return function (_x24, _x25) {
                        return _ref17.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto14 = kv.rpop;
                kv.rpop = function () {
                    var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(key) {
                        return _regenerator2.default.wrap(function _callee18$(_context18) {
                            while (1) {
                                switch (_context18.prev = _context18.next) {
                                    case 0:
                                        _context18.next = 2;
                                        return logger.rpop(key);

                                    case 2:
                                        _context18.next = 4;
                                        return _proto14.bind(kv)(key);

                                    case 4:
                                        return _context18.abrupt("return", _context18.sent);

                                    case 5:
                                    case "end":
                                        return _context18.stop();
                                }
                            }
                        }, _callee18, _this4);
                    }));

                    return function (_x26) {
                        return _ref18.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto15 = kv.linsert;
                kv.linsert = function () {
                    var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(key, index, value) {
                        return _regenerator2.default.wrap(function _callee19$(_context19) {
                            while (1) {
                                switch (_context19.prev = _context19.next) {
                                    case 0:
                                        _context19.next = 2;
                                        return logger.linsert(key, index, value);

                                    case 2:
                                        _context19.next = 4;
                                        return _proto15.bind(kv)(key, index, value);

                                    case 4:
                                        return _context19.abrupt("return", _context19.sent);

                                    case 5:
                                    case "end":
                                        return _context19.stop();
                                }
                            }
                        }, _callee19, _this4);
                    }));

                    return function (_x27, _x28, _x29) {
                        return _ref19.apply(this, arguments);
                    };
                }();
            }
            {
                var _proto16 = kv.lremove;
                kv.lremove = function () {
                    var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(key, index) {
                        return _regenerator2.default.wrap(function _callee20$(_context20) {
                            while (1) {
                                switch (_context20.prev = _context20.next) {
                                    case 0:
                                        _context20.next = 2;
                                        return logger.lremove(key, index);

                                    case 2:
                                        _context20.next = 4;
                                        return _proto16.bind(kv)(key, index);

                                    case 4:
                                        return _context20.abrupt("return", _context20.sent);

                                    case 5:
                                    case "end":
                                        return _context20.stop();
                                }
                            }
                        }, _callee20, _this4);
                    }));

                    return function (_x30, _x31) {
                        return _ref20.apply(this, arguments);
                    };
                }();
            }
        }
    }, {
        key: "logger",
        get: function get() {
            return this.m_logger;
        }
    }]);
    return LoggedStorage;
}();

exports.LoggedStorage = LoggedStorage;