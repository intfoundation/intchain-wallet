"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

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
var assert = require("assert");
var error_code_1 = require("../error_code");
var serializable_1 = require("../serializable");
var js_log_1 = require("./js_log");
var dump_snapshot_1 = require("./dump_snapshot");
var dump_snapshot_manager_1 = require("./dump_snapshot_manager");

var StorageLogSnapshotManager = function () {
    function StorageLogSnapshotManager(options) {
        (0, _classCallCheck3.default)(this, StorageLogSnapshotManager);

        this.m_snapshots = new _map2.default();
        this.m_recycling = false;
        this.m_logPath = path.join(options.path, 'log');
        if (options.dumpSnapshotManager) {
            this.m_dumpManager = options.dumpSnapshotManager;
        } else {
            this.m_dumpManager = new dump_snapshot_manager_1.StorageDumpSnapshotManager(options);
        }
        this.m_headerStorage = options.headerStorage;
        this.m_storageType = options.storageType;
        this.m_logger = options.logger;
    }

    (0, _createClass3.default)(StorageLogSnapshotManager, [{
        key: "recycle",
        value: function recycle() {
            this.m_logger.info("begin recycle snanshot");
            var recycledMap = new _map2.default(this.m_snapshots);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(recycledMap.entries()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
                        blockHash = _step$value[0],
                        stub = _step$value[1];

                    if (!stub.ref) {
                        this.m_logger.info("delete snapshot " + blockHash);
                        var err = this.m_dumpManager.removeSnapshot(blockHash);
                        if (!err) {
                            this.m_snapshots.delete(blockHash);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.m_recycling = false;
        }
    }, {
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var err, snapshots, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, ss;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                fs.ensureDirSync(this.m_logPath);
                                _context.next = 3;
                                return this.m_dumpManager.init();

                            case 3:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 6;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 6:
                                snapshots = this.m_dumpManager.listSnapshots();
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context.prev = 10;

                                for (_iterator2 = (0, _getIterator3.default)(snapshots); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    ss = _step2.value;

                                    this.m_snapshots.set(ss.blockHash, { ref: 0 });
                                }
                                _context.next = 18;
                                break;

                            case 14:
                                _context.prev = 14;
                                _context.t0 = _context["catch"](10);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context.t0;

                            case 18:
                                _context.prev = 18;
                                _context.prev = 19;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 21:
                                _context.prev = 21;

                                if (!_didIteratorError2) {
                                    _context.next = 24;
                                    break;
                                }

                                throw _iteratorError2;

                            case 24:
                                return _context.finish(21);

                            case 25:
                                return _context.finish(18);

                            case 26:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 27:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[10, 14, 18, 26], [19,, 21, 25]]);
            }));

            function init() {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "uninit",
        value: function uninit() {
            this.m_dumpManager.uninit();
            this.m_snapshots.clear();
        }
    }, {
        key: "createSnapshot",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(from, blockHash) {
                var csr, logger, writer, err;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.m_dumpManager.createSnapshot(from, blockHash);

                            case 2:
                                csr = _context2.sent;

                                if (!csr.err) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt("return", csr);

                            case 5:
                                logger = from.storageLogger;

                                if (logger) {
                                    writer = new serializable_1.BufferWriter();

                                    logger.finish();
                                    err = logger.encode(writer);

                                    if (err) {
                                        this.m_logger.error("encode redo logger failed ", blockHash);
                                    }
                                    fs.writeFileSync(this.getLogPath(blockHash), writer.render());
                                }
                                this.m_snapshots.set(blockHash, { ref: 0 });
                                return _context2.abrupt("return", csr);

                            case 9:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function createSnapshot(_x, _x2) {
                return _ref2.apply(this, arguments);
            }

            return createSnapshot;
        }()
    }, {
        key: "getSnapshotFilePath",
        value: function getSnapshotFilePath(blockHash) {
            return this.m_dumpManager.getSnapshotFilePath(blockHash);
        }
    }, {
        key: "getLogPath",
        value: function getLogPath(blockHash) {
            return path.join(this.m_logPath, blockHash + '.redo');
        }
    }, {
        key: "getRedoLog",
        value: function getRedoLog(blockHash) {
            var redoLogRaw = void 0;
            try {
                redoLogRaw = fs.readFileSync(this.getLogPath(blockHash));
            } catch (error) {
                this.m_logger.warn("read log file " + this.getLogPath(blockHash) + " failed.");
            }
            if (!redoLogRaw) {
                this.m_logger.error("get redo log " + blockHash + " failed");
                return undefined;
            }
            var redoLog = new js_log_1.JStorageLogger();
            var err = redoLog.decode(new serializable_1.BufferReader(redoLogRaw));
            if (err) {
                this.m_logger.error("decode redo log " + blockHash + " from storage failed");
                return undefined;
            }
            return redoLog;
        }
        // 保存redolog文件
        // 文件内容来源是 从其他节点请求来， 并不是本地节点自己运行的redolog

    }, {
        key: "writeRedoLog",
        value: function writeRedoLog(blockHash, redoLog) {
            this.m_logger.debug("write redo log " + blockHash);
            var filepath = this.getLogPath(blockHash);
            var writer = new serializable_1.BufferWriter();
            var err = redoLog.encode(writer);
            if (err) {
                this.m_logger.error("encode redo log failed ", redoLog);
                return err;
            }
            fs.writeFileSync(filepath, writer.render());
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "getSnapshot",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(blockHash) {
                var ssr, hr, blockPath, header, err, nearestSnapshot, _ssr, _hr, storage, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _blockHash, log;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.m_logger.debug("getting snapshot " + blockHash);
                                // 只能在storage manager 的实现中调用，在storage manager中保证不会以相同block hash重入
                                _context3.next = 3;
                                return this.m_dumpManager.getSnapshot(blockHash);

                            case 3:
                                ssr = _context3.sent;

                                if (ssr.err) {
                                    _context3.next = 11;
                                    break;
                                }

                                assert(this.m_snapshots.get(blockHash));
                                this.m_logger.debug("get snapshot " + blockHash + " directly from dump");
                                ++this.m_snapshots.get(blockHash).ref;
                                return _context3.abrupt("return", ssr);

                            case 11:
                                if (!(ssr.err !== error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context3.next = 14;
                                    break;
                                }

                                this.m_logger.error("get snapshot " + blockHash + " failed for dump manager get snapshot failed for " + ssr.err);
                                return _context3.abrupt("return", { err: ssr.err });

                            case 14:
                                _context3.next = 16;
                                return this.m_headerStorage.getHeader(blockHash);

                            case 16:
                                hr = _context3.sent;

                                if (!hr.err) {
                                    _context3.next = 20;
                                    break;
                                }

                                this.m_logger.error("get snapshot " + blockHash + " failed for load header failed " + hr.err);
                                return _context3.abrupt("return", { err: hr.err });

                            case 20:
                                blockPath = [];

                                blockPath.push(blockHash);
                                header = hr.header;
                                err = error_code_1.ErrorCode.RESULT_NOT_FOUND;
                                nearestSnapshot = void 0;

                            case 25:
                                _context3.next = 27;
                                return this.m_dumpManager.getSnapshot(header.hash);

                            case 27:
                                _ssr = _context3.sent;

                                if (_ssr.err) {
                                    _context3.next = 34;
                                    break;
                                }

                                nearestSnapshot = _ssr.snapshot;
                                err = _ssr.err;
                                return _context3.abrupt("break", 48);

                            case 34:
                                if (!(_ssr.err !== error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context3.next = 38;
                                    break;
                                }

                                this.m_logger.error("get snapshot " + blockHash + " failed for get dump " + header.hash + " failed " + _ssr.err);
                                err = _ssr.err;
                                return _context3.abrupt("break", 48);

                            case 38:
                                _context3.next = 40;
                                return this.m_headerStorage.getHeader(header.preBlockHash);

                            case 40:
                                _hr = _context3.sent;

                                if (!_hr.err) {
                                    _context3.next = 45;
                                    break;
                                }

                                this.m_logger.error("get snapshot " + blockHash + " failed for get header " + header.preBlockHash + " failed " + hr.err);
                                err = error_code_1.ErrorCode.RESULT_INVALID_BLOCK;
                                return _context3.abrupt("break", 48);

                            case 45:
                                header = _hr.header;
                                blockPath.push(header.hash);

                            case 47:
                                if (true) {
                                    _context3.next = 25;
                                    break;
                                }

                            case 48:
                                if (!err) {
                                    _context3.next = 51;
                                    break;
                                }

                                this.m_logger.error("get snapshot " + blockHash + " failed for " + err);
                                return _context3.abrupt("return", { err: err });

                            case 51:
                                /** 这段代码要保证同步 start */
                                storage = new this.m_storageType({
                                    filePath: this.m_dumpManager.getSnapshotFilePath(blockHash),
                                    logger: this.m_logger
                                });

                                fs.copyFileSync(nearestSnapshot.filePath, storage.filePath);
                                /** 这段代码要保证同步 end */
                                _context3.next = 55;
                                return storage.init();

                            case 55:
                                err = _context3.sent;

                                if (!err) {
                                    _context3.next = 59;
                                    break;
                                }

                                this.m_logger.error("get snapshot " + blockHash + " failed for storage init failed for " + err);
                                return _context3.abrupt("return", { err: err });

                            case 59:
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context3.prev = 62;
                                _iterator3 = (0, _getIterator3.default)(blockPath.reverse());

                            case 64:
                                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                    _context3.next = 81;
                                    break;
                                }

                                _blockHash = _step3.value;

                                if (fs.existsSync(this.getLogPath(_blockHash))) {
                                    _context3.next = 70;
                                    break;
                                }

                                this.m_logger.error("get snapshot " + blockHash + " failed for get redo log for " + _blockHash + " failed for not exist");
                                err = error_code_1.ErrorCode.RESULT_NOT_FOUND;
                                return _context3.abrupt("break", 81);

                            case 70:
                                log = void 0;

                                try {
                                    log = fs.readFileSync(this.getLogPath(_blockHash));
                                } catch (error) {
                                    this.m_logger.error("read log file " + this.getLogPath(_blockHash) + " failed.");
                                }
                                _context3.next = 74;
                                return storage.redo(log);

                            case 74:
                                err = _context3.sent;

                                if (!err) {
                                    _context3.next = 78;
                                    break;
                                }

                                this.m_logger.error("get snapshot " + blockHash + " failed for redo " + _blockHash + " failed for " + err);
                                return _context3.abrupt("break", 81);

                            case 78:
                                _iteratorNormalCompletion3 = true;
                                _context3.next = 64;
                                break;

                            case 81:
                                _context3.next = 87;
                                break;

                            case 83:
                                _context3.prev = 83;
                                _context3.t0 = _context3["catch"](62);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context3.t0;

                            case 87:
                                _context3.prev = 87;
                                _context3.prev = 88;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 90:
                                _context3.prev = 90;

                                if (!_didIteratorError3) {
                                    _context3.next = 93;
                                    break;
                                }

                                throw _iteratorError3;

                            case 93:
                                return _context3.finish(90);

                            case 94:
                                return _context3.finish(87);

                            case 95:
                                _context3.next = 97;
                                return storage.uninit();

                            case 97:
                                if (!err) {
                                    _context3.next = 102;
                                    break;
                                }

                                _context3.next = 100;
                                return storage.remove();

                            case 100:
                                this.m_logger.error("get snapshot " + blockHash + " failed for " + err);
                                return _context3.abrupt("return", { err: err });

                            case 102:
                                this.m_snapshots.set(blockHash, { ref: 1 });
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK,
                                    snapshot: new dump_snapshot_1.StorageDumpSnapshot(blockHash, storage.filePath) });

                            case 104:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[62, 83, 87, 95], [88,, 90, 94]]);
            }));

            function getSnapshot(_x3) {
                return _ref3.apply(this, arguments);
            }

            return getSnapshot;
        }()
    }, {
        key: "releaseSnapshot",
        value: function releaseSnapshot(blockHash) {
            var stub = this.m_snapshots.get(blockHash);
            if (stub) {
                assert(stub.ref > 0);
                if (stub.ref > 0) {
                    --stub.ref;
                }
            }
        }
    }]);
    return StorageLogSnapshotManager;
}();

exports.StorageLogSnapshotManager = StorageLogSnapshotManager;