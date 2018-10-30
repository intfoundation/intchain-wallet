"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var util_1 = require("util");
var error_code_1 = require("../error_code");
var storage_1 = require("./storage");
var log_snapshot_manager_1 = require("./log_snapshot_manager");

var StorageManager = function () {
    function StorageManager(options) {
        (0, _classCallCheck3.default)(this, StorageManager);

        this.m_views = new _map2.default();
        this.m_path = options.path;
        this.m_storageType = options.storageType;
        this.m_logger = options.logger;
        if (options.snapshotManager) {
            this.m_snapshotManager = options.snapshotManager;
        } else {
            this.m_snapshotManager = new log_snapshot_manager_1.StorageLogSnapshotManager(options);
        }
        this.m_readonly = !!options.readonly;
    }

    (0, _createClass3.default)(StorageManager, [{
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var err;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.m_snapshotManager.init();

                            case 2:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 5:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 6:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function init() {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "uninit",
        value: function uninit() {
            this.m_snapshotManager.uninit();
        }
    }, {
        key: "createSnapshot",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(from, blockHash, remove) {
                var csr;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!this.m_readonly) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });

                            case 2:
                                _context2.next = 4;
                                return this.m_snapshotManager.createSnapshot(from, blockHash);

                            case 4:
                                csr = _context2.sent;

                                if (!csr.err) {
                                    _context2.next = 7;
                                    break;
                                }

                                return _context2.abrupt("return", csr);

                            case 7:
                                if (!remove) {
                                    _context2.next = 10;
                                    break;
                                }

                                _context2.next = 10;
                                return from.remove();

                            case 10:
                                return _context2.abrupt("return", csr);

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function createSnapshot(_x, _x2, _x3) {
                return _ref2.apply(this, arguments);
            }

            return createSnapshot;
        }()
    }, {
        key: "getSnapshot",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(blockHash) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.m_snapshotManager.getSnapshot(blockHash);

                            case 2:
                                return _context3.abrupt("return", _context3.sent);

                            case 3:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getSnapshot(_x4) {
                return _ref3.apply(this, arguments);
            }

            return getSnapshot;
        }()
    }, {
        key: "createStorage",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(name, from) {
                var storage, err, ssr;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!this.m_readonly) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });

                            case 2:
                                storage = new this.m_storageType({
                                    filePath: path.join(this.m_path, name),
                                    logger: this.m_logger
                                });
                                _context4.next = 5;
                                return storage.remove();

                            case 5:
                                err = void 0;

                                if (from) {
                                    _context4.next = 13;
                                    break;
                                }

                                this.m_logger.info("create storage " + name);
                                _context4.next = 10;
                                return storage.init();

                            case 10:
                                err = _context4.sent;
                                _context4.next = 40;
                                break;

                            case 13:
                                if (!util_1.isString(from)) {
                                    _context4.next = 30;
                                    break;
                                }

                                this.m_logger.info("create storage " + name + " from snapshot " + from);
                                _context4.next = 17;
                                return this._getSnapshotStorage(from);

                            case 17:
                                ssr = _context4.sent;

                                if (!ssr.err) {
                                    _context4.next = 23;
                                    break;
                                }

                                this.m_logger.error("get snapshot failed for " + from);
                                err = ssr.err;
                                _context4.next = 28;
                                break;

                            case 23:
                                fs.copyFileSync(ssr.storage.filePath, storage.filePath);
                                this.releaseSnapshotView(from);
                                _context4.next = 27;
                                return storage.init();

                            case 27:
                                err = _context4.sent;

                            case 28:
                                _context4.next = 40;
                                break;

                            case 30:
                                if (!(from instanceof storage_1.Storage)) {
                                    _context4.next = 38;
                                    break;
                                }

                                this.m_logger.info("create storage " + name + " from snapshot " + storage.filePath);
                                fs.copyFileSync(from.filePath, storage.filePath);
                                _context4.next = 35;
                                return storage.init();

                            case 35:
                                err = _context4.sent;
                                _context4.next = 40;
                                break;

                            case 38:
                                this.m_logger.error("create storage " + name + " with invalid from " + from);
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM });

                            case 40:
                                if (!err) {
                                    _context4.next = 43;
                                    break;
                                }

                                this.m_logger.error("create storage " + name + " failed for " + err);
                                return _context4.abrupt("return", { err: err });

                            case 43:
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, storage: storage });

                            case 44:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function createStorage(_x5, _x6) {
                return _ref4.apply(this, arguments);
            }

            return createStorage;
        }()
    }, {
        key: "_getSnapshotStorage",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(blockHash) {
                var _this = this;

                var stub, sr, ret;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                stub = this.m_views.get(blockHash);

                                if (!stub) {
                                    _context5.next = 8;
                                    break;
                                }

                                ++stub.ref;

                                if (!stub.storage.isInit) {
                                    _context5.next = 7;
                                    break;
                                }

                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, storage: stub.storage });

                            case 7:
                                return _context5.abrupt("return", new _promise2.default(function (resolve) {
                                    stub.storage.once('init', function (err) {
                                        if (err) {
                                            resolve({ err: err });
                                        } else {
                                            resolve({ err: err, storage: stub.storage });
                                        }
                                    });
                                }));

                            case 8:
                                stub = {
                                    storage: new this.m_storageType({
                                        filePath: this.m_snapshotManager.getSnapshotFilePath(blockHash),
                                        logger: this.m_logger
                                    }),
                                    ref: 1
                                };
                                this.m_views.set(blockHash, stub);
                                _context5.next = 12;
                                return this.m_snapshotManager.getSnapshot(blockHash);

                            case 12:
                                sr = _context5.sent;

                                if (!sr.err) {
                                    _context5.next = 17;
                                    break;
                                }

                                this.m_logger.error("get snapshot failed for " + sr.err);
                                this.m_views.delete(blockHash);
                                return _context5.abrupt("return", { err: sr.err });

                            case 17:
                                ret = new _promise2.default(function (resolve) {
                                    stub.storage.once('init', function (err) {
                                        if (err) {
                                            _this.m_snapshotManager.releaseSnapshot(blockHash);
                                            _this.m_views.delete(blockHash);
                                            resolve({ err: err });
                                        } else {
                                            resolve({ err: err, storage: stub.storage });
                                        }
                                    });
                                });

                                stub.storage.init(true);
                                return _context5.abrupt("return", ret);

                            case 20:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _getSnapshotStorage(_x7) {
                return _ref5.apply(this, arguments);
            }

            return _getSnapshotStorage;
        }()
    }, {
        key: "getSnapshotView",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(blockHash) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this._getSnapshotStorage(blockHash);

                            case 2:
                                return _context6.abrupt("return", _context6.sent);

                            case 3:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function getSnapshotView(_x8) {
                return _ref6.apply(this, arguments);
            }

            return getSnapshotView;
        }()
        // 根据block hash 获取redo log内容
        // 提供给chain_node层引用

    }, {
        key: "getRedoLog",
        value: function getRedoLog(blockHash) {
            return this.m_snapshotManager.getRedoLog(blockHash);
        }
        // 对象形式的redo log（通过网络请求, 然后解析buffer获得) 写入至本地文件
        // 提供给chain层引用

    }, {
        key: "writeRedoLog",
        value: function writeRedoLog(blockHash, log) {
            if (this.m_readonly) {
                return error_code_1.ErrorCode.RESULT_NOT_SUPPORT;
            }
            return this.m_snapshotManager.writeRedoLog(blockHash, log);
        }
    }, {
        key: "releaseSnapshotView",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(blockHash) {
                var stub;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                stub = this.m_views.get(blockHash);

                                if (!stub) {
                                    _context7.next = 8;
                                    break;
                                }

                                --stub.ref;

                                if (stub.ref) {
                                    _context7.next = 8;
                                    break;
                                }

                                this.m_views.delete(blockHash);
                                // 这里await也不能保证互斥， 可能在uninit过程中再次创建，只能靠readonly保证在一个path上创建多个storage 实例
                                _context7.next = 7;
                                return stub.storage.uninit();

                            case 7:
                                this.m_snapshotManager.releaseSnapshot(blockHash);

                            case 8:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function releaseSnapshotView(_x9) {
                return _ref7.apply(this, arguments);
            }

            return releaseSnapshotView;
        }()
    }, {
        key: "recycleSnapShot",
        value: function recycleSnapShot() {
            return this.m_snapshotManager.recycle();
        }
    }, {
        key: "path",
        get: function get() {
            return this.m_path;
        }
    }]);
    return StorageManager;
}();

exports.StorageManager = StorageManager;