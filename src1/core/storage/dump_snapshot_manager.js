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
var path = require("path");
var fs = require("fs-extra");
var error_code_1 = require("../error_code");
var dump_snapshot_1 = require("./dump_snapshot");

var StorageDumpSnapshotManager = function () {
    function StorageDumpSnapshotManager(options) {
        (0, _classCallCheck3.default)(this, StorageDumpSnapshotManager);

        this.m_path = path.join(options.path, 'dump');
        this.m_logger = options.logger;
    }

    (0, _createClass3.default)(StorageDumpSnapshotManager, [{
        key: "recycle",
        value: function recycle() {}
    }, {
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                fs.ensureDirSync(this.m_path);
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
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
            // do nothing
        }
    }, {
        key: "listSnapshots",
        value: function listSnapshots() {
            var _this = this;

            var blocks = fs.readdirSync(this.m_path);
            return blocks.map(function (blockHash) {
                return new dump_snapshot_1.StorageDumpSnapshot(blockHash, _this.getSnapshotFilePath(blockHash));
            });
        }
    }, {
        key: "getSnapshotFilePath",
        value: function getSnapshotFilePath(blockHash) {
            return path.join(this.m_path, blockHash);
        }
    }, {
        key: "createSnapshot",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(from, blockHash) {
                var snapshot;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.m_logger.info("creating snapshot " + blockHash);
                                snapshot = new dump_snapshot_1.StorageDumpSnapshot(blockHash, this.getSnapshotFilePath(blockHash));

                                fs.copyFileSync(from.filePath, snapshot.filePath);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, snapshot: snapshot });

                            case 4:
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
        key: "getSnapshot",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(blockHash) {
                var snapshot;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                snapshot = new dump_snapshot_1.StorageDumpSnapshot(blockHash, this.getSnapshotFilePath(blockHash));

                                if (!snapshot.exists()) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, snapshot: snapshot });

                            case 5:
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 6:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getSnapshot(_x3) {
                return _ref3.apply(this, arguments);
            }

            return getSnapshot;
        }()
    }, {
        key: "releaseSnapshot",
        value: function releaseSnapshot(blockHash) {}
    }, {
        key: "removeSnapshot",
        value: function removeSnapshot(blockHash) {
            var snapshot = new dump_snapshot_1.StorageDumpSnapshot(blockHash, this.getSnapshotFilePath(blockHash));
            try {
                fs.removeSync(snapshot.filePath);
            } catch (e) {
                this.m_logger.error("removeSnapshot " + blockHash + " ", e);
                return error_code_1.ErrorCode.RESULT_EXCEPTION;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }]);
    return StorageDumpSnapshotManager;
}();

exports.StorageDumpSnapshotManager = StorageDumpSnapshotManager;