"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

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

var TransactionLogger = function () {
    function TransactionLogger(owner) {
        (0, _classCallCheck3.default)(this, TransactionLogger);

        this.owner = owner;
    }

    (0, _createClass3.default)(TransactionLogger, [{
        key: "beginTransaction",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.owner.appendLog("{let trans = (await storage.beginTransaction()).value;");
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function beginTransaction() {
                return _ref.apply(this, arguments);
            }

            return beginTransaction;
        }()
    }, {
        key: "commit",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.owner.appendLog("await trans.commit();}");
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function commit() {
                return _ref2.apply(this, arguments);
            }

            return commit;
        }()
    }, {
        key: "rollback",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.owner.appendLog("await trans.rollback();}");
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function rollback() {
                return _ref3.apply(this, arguments);
            }

            return rollback;
        }()
    }]);
    return TransactionLogger;
}();

var KeyValueLogger = function () {
    function KeyValueLogger(owner, name) {
        (0, _classCallCheck3.default)(this, KeyValueLogger);

        this.owner = owner;
        this.name = name;
    }

    (0, _createClass3.default)(KeyValueLogger, [{
        key: "get",
        value: function get(key) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "hexists",
        value: function hexists(key, field) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "hget",
        value: function hget(key, field) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "hmget",
        value: function hmget(key, fields) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "hlen",
        value: function hlen(key) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "hkeys",
        value: function hkeys(key) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "hvalues",
        value: function hvalues(key) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "hgetall",
        value: function hgetall(key) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "lindex",
        value: function lindex(key, index) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "llen",
        value: function llen(key) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "lrange",
        value: function lrange(key, start, stop) {
            return _promise2.default.resolve({ err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });
        }
    }, {
        key: "set",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(key, value) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".set(" + (0, _stringify2.default)(key) + ", " + (0, _stringify2.default)(value) + ");");
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function set(_x, _x2) {
                return _ref4.apply(this, arguments);
            }

            return set;
        }()
        // hash

    }, {
        key: "hset",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(key, field, value) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".hset(" + (0, _stringify2.default)(key) + ", " + (0, _stringify2.default)(field) + ", " + (0, _stringify2.default)(value) + ");");
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function hset(_x3, _x4, _x5) {
                return _ref5.apply(this, arguments);
            }

            return hset;
        }()
    }, {
        key: "hmset",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(key, fields, values) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".hmset(" + (0, _stringify2.default)(key) + ", " + (0, _stringify2.default)(fields) + ", " + (0, _stringify2.default)(values) + ");");
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function hmset(_x6, _x7, _x8) {
                return _ref6.apply(this, arguments);
            }

            return hmset;
        }()
    }, {
        key: "hclean",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(key) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".hclean(" + (0, _stringify2.default)(key) + ");");
                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function hclean(_x9) {
                return _ref7.apply(this, arguments);
            }

            return hclean;
        }()
    }, {
        key: "hdel",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(key, field) {
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".hdel(" + key + "," + field + ")");
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function hdel(_x10, _x11) {
                return _ref8.apply(this, arguments);
            }

            return hdel;
        }()
        // array

    }, {
        key: "lset",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(key, index, value) {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".lset(" + (0, _stringify2.default)(key) + ", " + index + ", " + (0, _stringify2.default)(value) + ");");
                                return _context9.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function lset(_x12, _x13, _x14) {
                return _ref9.apply(this, arguments);
            }

            return lset;
        }()
    }, {
        key: "lpush",
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(key, value) {
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".lpush(" + (0, _stringify2.default)(key) + ", " + (0, _stringify2.default)(value) + ");");
                                return _context10.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function lpush(_x15, _x16) {
                return _ref10.apply(this, arguments);
            }

            return lpush;
        }()
    }, {
        key: "lpushx",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(key, value) {
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".lpushx(" + (0, _stringify2.default)(key) + ", " + (0, _stringify2.default)(value) + ");");
                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function lpushx(_x17, _x18) {
                return _ref11.apply(this, arguments);
            }

            return lpushx;
        }()
    }, {
        key: "lpop",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(key) {
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".lpop(" + (0, _stringify2.default)(key) + ");");
                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function lpop(_x19) {
                return _ref12.apply(this, arguments);
            }

            return lpop;
        }()
    }, {
        key: "rpush",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(key, value) {
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".rpush(" + (0, _stringify2.default)(key) + ", " + (0, _stringify2.default)(value) + ");");
                                return _context13.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function rpush(_x20, _x21) {
                return _ref13.apply(this, arguments);
            }

            return rpush;
        }()
    }, {
        key: "rpushx",
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(key, value) {
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".rpushx(" + (0, _stringify2.default)(key) + ", " + (0, _stringify2.default)(value) + ");");
                                return _context14.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function rpushx(_x22, _x23) {
                return _ref14.apply(this, arguments);
            }

            return rpushx;
        }()
    }, {
        key: "rpop",
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(key) {
                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".rpop(" + (0, _stringify2.default)(key) + ");");
                                return _context15.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function rpop(_x24) {
                return _ref15.apply(this, arguments);
            }

            return rpop;
        }()
    }, {
        key: "linsert",
        value: function () {
            var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(key, index, value) {
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".linsert(" + (0, _stringify2.default)(key) + ", " + index + ", " + (0, _stringify2.default)(value) + ");");
                                return _context16.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function linsert(_x25, _x26, _x27) {
                return _ref16.apply(this, arguments);
            }

            return linsert;
        }()
    }, {
        key: "lremove",
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(key, index) {
                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                this.owner.appendLog("await " + this.name + ".lremove(" + (0, _stringify2.default)(key) + ", " + index + ");");
                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 2:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function lremove(_x28, _x29) {
                return _ref17.apply(this, arguments);
            }

            return lremove;
        }()
    }]);
    return KeyValueLogger;
}();

var DatabaseLogger = function () {
    function DatabaseLogger(owner, name) {
        (0, _classCallCheck3.default)(this, DatabaseLogger);

        this.owner = owner;
        this.name = name;
        this.m_nextVal = 0;
    }

    (0, _createClass3.default)(DatabaseLogger, [{
        key: "_kvVal",
        value: function _kvVal() {
            var val = this.name + "kv" + this.m_nextVal;
            ++this.m_nextVal;
            return val;
        }
    }, {
        key: "createKeyValue",
        value: function () {
            var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(name) {
                var val;
                return _regenerator2.default.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                val = this._kvVal();

                                this.owner.appendLog("let " + val + " = (await " + this.name + ".createKeyValue(" + (0, _stringify2.default)(name) + ")).kv;");
                                return _context18.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, kv: new KeyValueLogger(this.owner, val) });

                            case 3:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            }));

            function createKeyValue(_x30) {
                return _ref18.apply(this, arguments);
            }

            return createKeyValue;
        }()
    }, {
        key: "getReadWritableKeyValue",
        value: function () {
            var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(name) {
                var val;
                return _regenerator2.default.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                val = this._kvVal();

                                this.owner.appendLog("let " + val + " = (await " + this.name + ".getReadWritableKeyValue(" + (0, _stringify2.default)(name) + ")).kv;");
                                return _context19.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, kv: new KeyValueLogger(this.owner, val) });

                            case 3:
                            case "end":
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function getReadWritableKeyValue(_x31) {
                return _ref19.apply(this, arguments);
            }

            return getReadWritableKeyValue;
        }()
    }]);
    return DatabaseLogger;
}();

var JStorageLogger = function () {
    function JStorageLogger() {
        (0, _classCallCheck3.default)(this, JStorageLogger);

        this.m_log = '';
        this.m_nextVal = 0;
        this.m_log = '';
    }

    (0, _createClass3.default)(JStorageLogger, [{
        key: "_dbVal",
        value: function _dbVal() {
            var val = "db" + this.m_nextVal;
            ++this.m_nextVal;
            return val;
        }
    }, {
        key: "redoOnStorage",
        value: function redoOnStorage(storage) {
            var _this = this;

            return new _promise2.default(function (resolve) {
                eval(_this.m_log);
            });
        }
    }, {
        key: "encode",
        value: function encode(writer) {
            writer.writeVarString(this.m_log);
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            this.m_log = reader.readVarString();
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "init",
        value: function init() {
            this.m_log = 'async function redo() {';
        }
    }, {
        key: "finish",
        value: function finish() {
            this.appendLog('}; redo().then(()=>{resolve(0);})');
        }
    }, {
        key: "appendLog",
        value: function appendLog(log) {
            this.m_log += log;
        }
    }, {
        key: "createDatabase",
        value: function () {
            var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(name) {
                var val;
                return _regenerator2.default.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                val = this._dbVal();

                                this.appendLog("let " + val + " = (await storage.createDatabase(" + (0, _stringify2.default)(name) + ")).value;");
                                return _context20.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: new DatabaseLogger(this, val) });

                            case 3:
                            case "end":
                                return _context20.stop();
                        }
                    }
                }, _callee20, this);
            }));

            function createDatabase(_x32) {
                return _ref20.apply(this, arguments);
            }

            return createDatabase;
        }()
    }, {
        key: "getReadWritableDatabase",
        value: function () {
            var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(name) {
                var val;
                return _regenerator2.default.wrap(function _callee21$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:
                                val = this._dbVal();

                                this.appendLog("let " + val + " = (await storage.getReadWritableDatabase(" + (0, _stringify2.default)(name) + ")).value;");
                                return _context21.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: new DatabaseLogger(this, val) });

                            case 3:
                            case "end":
                                return _context21.stop();
                        }
                    }
                }, _callee21, this);
            }));

            function getReadWritableDatabase(_x33) {
                return _ref21.apply(this, arguments);
            }

            return getReadWritableDatabase;
        }()
    }, {
        key: "beginTransaction",
        value: function () {
            var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
                return _regenerator2.default.wrap(function _callee22$(_context22) {
                    while (1) {
                        switch (_context22.prev = _context22.next) {
                            case 0:
                                return _context22.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: new TransactionLogger(this) });

                            case 1:
                            case "end":
                                return _context22.stop();
                        }
                    }
                }, _callee22, this);
            }));

            function beginTransaction() {
                return _ref22.apply(this, arguments);
            }

            return beginTransaction;
        }()
    }, {
        key: "log",
        get: function get() {
            return this.m_log;
        }
    }]);
    return JStorageLogger;
}();

exports.JStorageLogger = JStorageLogger;