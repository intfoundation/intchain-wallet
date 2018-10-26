"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var fs = require("fs-extra");
var assert = require('assert');
var error_code_1 = require("../error_code");
var logger_1 = require("./logger");
var reader_1 = require("../lib/reader");
var digest = require('../lib/digest');

var IReadableStorage = function IReadableStorage() {
    (0, _classCallCheck3.default)(this, IReadableStorage);
};

exports.IReadableStorage = IReadableStorage;

var IReadWritableStorage = function (_IReadableStorage) {
    (0, _inherits3.default)(IReadWritableStorage, _IReadableStorage);

    function IReadWritableStorage() {
        (0, _classCallCheck3.default)(this, IReadWritableStorage);
        return (0, _possibleConstructorReturn3.default)(this, (IReadWritableStorage.__proto__ || (0, _getPrototypeOf2.default)(IReadWritableStorage)).apply(this, arguments));
    }

    return IReadWritableStorage;
}(IReadableStorage);

exports.IReadWritableStorage = IReadWritableStorage;

var Storage = function (_IReadWritableStorage) {
    (0, _inherits3.default)(Storage, _IReadWritableStorage);

    function Storage(options) {
        (0, _classCallCheck3.default)(this, Storage);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (Storage.__proto__ || (0, _getPrototypeOf2.default)(Storage)).call(this));

        _this2.m_eventEmitter = new events_1.EventEmitter();
        _this2.m_filePath = options.filePath;
        _this2.m_logger = options.logger;
        return _this2;
    }

    (0, _createClass3.default)(Storage, [{
        key: "createLogger",
        value: function createLogger() {
            if (!this.m_storageLogger) {
                this.m_storageLogger = new logger_1.LoggedStorage(this, this._createLogger());
            }
        }
    }, {
        key: "on",
        value: function on(event, listener) {
            this.m_eventEmitter.on(event, listener);
            return this;
        }
    }, {
        key: "once",
        value: function once(event, listener) {
            this.m_eventEmitter.once(event, listener);
            return this;
        }
    }, {
        key: "redo",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(logBuf) {
                var logger, err;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                logger = this._createLogger();
                                err = logger.decode(new reader_1.BufferReader(logBuf));

                                if (!err) {
                                    _context.next = 4;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 4:
                                return _context.abrupt("return", logger.redoOnStorage(this));

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function redo(_x) {
                return _ref.apply(this, arguments);
            }

            return redo;
        }()
    }, {
        key: "reset",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var err;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.remove();

                            case 2:
                                err = _context2.sent;

                                if (!err) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt("return", err);

                            case 5:
                                _context2.next = 7;
                                return this.init();

                            case 7:
                                return _context2.abrupt("return", _context2.sent);

                            case 8:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function reset() {
                return _ref2.apply(this, arguments);
            }

            return reset;
        }()
    }, {
        key: "remove",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.uninit();

                            case 2:
                                _context3.prev = 2;

                                fs.removeSync(this.m_filePath);
                                _context3.next = 10;
                                break;

                            case 6:
                                _context3.prev = 6;
                                _context3.t0 = _context3["catch"](2);

                                this.m_logger.error("remove storage " + this.m_filePath + " failed ", _context3.t0);
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 10:
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 11:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[2, 6]]);
            }));

            function remove() {
                return _ref3.apply(this, arguments);
            }

            return remove;
        }()
    }, {
        key: "messageDigest",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var buf, hash;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return fs.readFile(this.m_filePath);

                            case 2:
                                buf = _context4.sent;
                                hash = digest.hash256(buf).toString('hex');
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: hash });

                            case 5:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function messageDigest() {
                return _ref4.apply(this, arguments);
            }

            return messageDigest;
        }()
    }, {
        key: "getKeyValue",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(dbName, kvName) {
                var err, dbr;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                err = Storage.checkDataBaseName(dbName);

                                if (!err) {
                                    _context5.next = 3;
                                    break;
                                }

                                return _context5.abrupt("return", { err: err });

                            case 3:
                                err = Storage.checkTableName(dbName);

                                if (!err) {
                                    _context5.next = 6;
                                    break;
                                }

                                return _context5.abrupt("return", { err: err });

                            case 6:
                                _context5.next = 8;
                                return this.getReadWritableDatabase(dbName);

                            case 8:
                                dbr = _context5.sent;

                                if (!dbr.err) {
                                    _context5.next = 11;
                                    break;
                                }

                                return _context5.abrupt("return", { err: dbr.err });

                            case 11:
                                return _context5.abrupt("return", dbr.value.getReadWritableKeyValue(kvName));

                            case 12:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function getKeyValue(_x2, _x3) {
                return _ref5.apply(this, arguments);
            }

            return getKeyValue;
        }()
    }, {
        key: "getTable",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(fullName) {
                var names, dbr;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                names = Storage.splitFullName(fullName);

                                if (names.dbName) {
                                    _context6.next = 3;
                                    break;
                                }

                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM });

                            case 3:
                                _context6.next = 5;
                                return this.getReadWritableDatabase(names.dbName);

                            case 5:
                                dbr = _context6.sent;

                                if (!dbr.err) {
                                    _context6.next = 8;
                                    break;
                                }

                                return _context6.abrupt("return", { err: dbr.err });

                            case 8:
                                if (!names.kvName) {
                                    _context6.next = 12;
                                    break;
                                }

                                return _context6.abrupt("return", dbr.value.getReadWritableKeyValue(names.kvName));

                            case 12:
                                assert(false, "invalid fullName " + fullName);
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 14:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function getTable(_x4) {
                return _ref6.apply(this, arguments);
            }

            return getTable;
        }()
    }, {
        key: "storageLogger",
        get: function get() {
            if (this.m_storageLogger) {
                return this.m_storageLogger.logger;
            }
        }
    }, {
        key: "filePath",
        get: function get() {
            return this.m_filePath;
        }
    }], [{
        key: "getKeyValueFullName",
        value: function getKeyValueFullName(dbName, kvName) {
            return "" + dbName + this.keyValueNameSpec + kvName;
        }
    }, {
        key: "checkDataBaseName",
        value: function checkDataBaseName(name) {
            if (Storage.splitFullName(name).dbName) {
                return error_code_1.ErrorCode.RESULT_INVALID_PARAM;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "checkTableName",
        value: function checkTableName(name) {
            if (Storage.splitFullName(name).dbName) {
                return error_code_1.ErrorCode.RESULT_INVALID_PARAM;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "splitFullName",
        value: function splitFullName(fullName) {
            var i = fullName.indexOf(this.keyValueNameSpec);
            if (i > 0) {
                var dbName = fullName.substr(0, i);
                var kvName = fullName.substr(i + 1);
                return {
                    dbName: dbName,
                    kvName: kvName
                };
            }
            return {};
        }
    }]);
    return Storage;
}(IReadWritableStorage);

Storage.keyValueNameSpec = '#';
exports.Storage = Storage;