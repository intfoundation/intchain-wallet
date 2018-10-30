"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _setImmediate2 = require("babel-runtime/core-js/set-immediate");

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var events_1 = require("events");
var path = require("path");
var sqlite = require("sqlite");
var sqlite3 = require("sqlite3");
var fs = require("fs-extra");
var util_1 = require("util");
var error_code_1 = require("../error_code");
var logger_util_1 = require("../lib/logger_util");
var block_1 = require("../block");
var storage_1 = require("../storage");
var storage_2 = require("../storage_sqlite/storage");
var pending_1 = require("./pending");
var executor_1 = require("../executor");
var chain_node_1 = require("./chain_node");
var util_2 = require("util");
var ChainState;
(function (ChainState) {
    ChainState[ChainState["none"] = 0] = "none";
    ChainState[ChainState["init"] = 1] = "init";
    ChainState[ChainState["syncing"] = 2] = "syncing";
    ChainState[ChainState["synced"] = 3] = "synced";
})(ChainState || (ChainState = {}));

var Chain = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(Chain, _events_1$EventEmitte);

    /**
     * @param options.dataDir
     * @param options.blockHeaderType
     * @param options.node
     */
    function Chain(options) {
        (0, _classCallCheck3.default)(this, Chain);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Chain.__proto__ || (0, _getPrototypeOf2.default)(Chain)).call(this));

        _this.m_state = ChainState.none;
        _this.m_refSnapshots = [];
        _this.m_constSnapshots = [];
        _this.m_pendingHeaders = new Array();
        _this.m_pendingBlocks = {
            hashes: new _set2.default(),
            sequence: new Array()
        };
        _this.m_connSyncMap = new _map2.default();
        _this.m_logger = logger_util_1.initLogger(options);
        return _this;
    }

    (0, _createClass3.default)(Chain, [{
        key: "on",
        value: function on(event, listener) {
            return (0, _get3.default)(Chain.prototype.__proto__ || (0, _getPrototypeOf2.default)(Chain.prototype), "on", this).call(this, event, listener);
        }
    }, {
        key: "prependListener",
        value: function prependListener(event, listener) {
            return (0, _get3.default)(Chain.prototype.__proto__ || (0, _getPrototypeOf2.default)(Chain.prototype), "prependListener", this).call(this, event, listener);
        }
    }, {
        key: "once",
        value: function once(event, listener) {
            return (0, _get3.default)(Chain.prototype.__proto__ || (0, _getPrototypeOf2.default)(Chain.prototype), "once", this).call(this, event, listener);
        }
    }, {
        key: "prependOnceListener",
        value: function prependOnceListener(event, listener) {
            return (0, _get3.default)(Chain.prototype.__proto__ || (0, _getPrototypeOf2.default)(Chain.prototype), "prependOnceListener", this).call(this, event, listener);
        }
        // broadcast数目，广播header时会同时广播tip到这个深度的header

    }, {
        key: "_onLoadGlobalOptions",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 1:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _onLoadGlobalOptions() {
                return _ref.apply(this, arguments);
            }

            return _onLoadGlobalOptions;
        }()
    }, {
        key: "setGlobalOptions",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(globalOptions) {
                var err;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!this.m_globalOptions) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                                this.m_globalOptions = (0, _create2.default)(null);
                                (0, _assign2.default)(this.m_globalOptions, globalOptions);

                                if (this._onCheckGlobalOptions(globalOptions)) {
                                    _context2.next = 7;
                                    break;
                                }

                                this.m_logger.error("chain initialize failed for check global options failed");
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_BLOCK);

                            case 7:
                                this.m_globalOptions = globalOptions;
                                _context2.next = 10;
                                return this._onLoadGlobalOptions();

                            case 10:
                                err = _context2.sent;
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 12:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function setGlobalOptions(_x) {
                return _ref2.apply(this, arguments);
            }

            return setGlobalOptions;
        }()
    }, {
        key: "_loadGenesis",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var genesis, gsv, dbr, kvr, typeOptions, kvgr, err;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!this.m_globalOptions) {
                                    _context3.next = 2;
                                    break;
                                }

                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                                _context3.next = 4;
                                return this.m_headerStorage.getHeader(0);

                            case 4:
                                genesis = _context3.sent;

                                if (!genesis.err) {
                                    _context3.next = 7;
                                    break;
                                }

                                return _context3.abrupt("return", genesis.err);

                            case 7:
                                _context3.next = 9;
                                return this.m_storageManager.getSnapshotView(genesis.header.hash);

                            case 9:
                                gsv = _context3.sent;

                                if (!gsv.err) {
                                    _context3.next = 13;
                                    break;
                                }

                                this.m_logger.error("chain initialize failed for load genesis snapshot failed " + gsv.err);
                                return _context3.abrupt("return", gsv.err);

                            case 13:
                                this.m_constSnapshots.push(genesis.header.hash);
                                _context3.next = 16;
                                return gsv.storage.getReadableDataBase(Chain.dbSystem);

                            case 16:
                                dbr = _context3.sent;

                                if (!dbr.err) {
                                    _context3.next = 20;
                                    break;
                                }

                                this.m_logger.error("chain initialize failed for load system database failed " + dbr.err);
                                return _context3.abrupt("return", dbr.err);

                            case 20:
                                _context3.next = 22;
                                return dbr.value.getReadableKeyValue(Chain.kvConfig);

                            case 22:
                                kvr = _context3.sent;

                                if (!kvr.err) {
                                    _context3.next = 26;
                                    break;
                                }

                                this.m_logger.error("chain initialize failed for load global config failed " + kvr.err);
                                return _context3.abrupt("return", kvr.err);

                            case 26:
                                typeOptions = (0, _create2.default)(null);
                                _context3.next = 29;
                                return kvr.kv.get('consensus');

                            case 29:
                                kvgr = _context3.sent;

                                if (!kvgr.err) {
                                    _context3.next = 33;
                                    break;
                                }

                                this.m_logger.error("chain initialize failed for load global config consensus failed " + kvgr.err);
                                return _context3.abrupt("return", kvgr.err);

                            case 33:
                                typeOptions.consensus = kvgr.value;
                                _context3.next = 36;
                                return kvr.kv.lrange('features', 1, -1);

                            case 36:
                                kvgr = _context3.sent;

                                if (!(kvgr.err === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context3.next = 41;
                                    break;
                                }

                                typeOptions.features = kvgr.value;
                                _context3.next = 47;
                                break;

                            case 41:
                                if (!(kvgr.err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context3.next = 45;
                                    break;
                                }

                                typeOptions.features = [];
                                _context3.next = 47;
                                break;

                            case 45:
                                this.m_logger.error("chain initialize failed for load global config features failed " + kvgr.err);
                                return _context3.abrupt("return", kvgr.err);

                            case 47:
                                if (this._onCheckTypeOptions(typeOptions)) {
                                    _context3.next = 50;
                                    break;
                                }

                                this.m_logger.error("chain initialize failed for check type options failed");
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_BLOCK);

                            case 50:
                                _context3.next = 52;
                                return kvr.kv.hgetall('global');

                            case 52:
                                kvgr = _context3.sent;

                                if (!kvgr.err) {
                                    _context3.next = 56;
                                    break;
                                }

                                this.m_logger.error("chain initialize failed for load global config global failed " + kvgr.err);
                                return _context3.abrupt("return", kvgr.err);

                            case 56:
                                // 将hgetall返回的数组转换成对象
                                if (Array.isArray(kvgr.value)) {
                                    kvgr.value = kvgr.value.reduce(function (obj, item) {
                                        var key = item.key,
                                            value = item.value;

                                        obj[key] = value;
                                        return obj;
                                    }, {});
                                }
                                _context3.next = 59;
                                return this.setGlobalOptions(kvgr.value);

                            case 59:
                                err = _context3.sent;
                                return _context3.abrupt("return", err);

                            case 61:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _loadGenesis() {
                return _ref3.apply(this, arguments);
            }

            return _loadGenesis;
        }()
    }, {
        key: "initComponents",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(dataDir, handler, options) {
                var readonly, sqliteOptions, err;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!(this.m_state >= ChainState.init)) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                                this.m_dataDir = dataDir;
                                this.m_handler = handler;
                                readonly = options && options.readonly;

                                this.m_blockStorage = new block_1.BlockStorage({
                                    logger: this.m_logger,
                                    path: dataDir,
                                    blockHeaderType: this._getBlockHeaderType(),
                                    transactionType: this._getTransactionType(),
                                    readonly: readonly
                                });
                                _context4.next = 8;
                                return this.m_blockStorage.init();

                            case 8:
                                sqliteOptions = {};

                                if (!readonly) {
                                    sqliteOptions.mode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
                                } else {
                                    sqliteOptions.mode = sqlite3.OPEN_READONLY;
                                }
                                _context4.next = 12;
                                return sqlite.open(dataDir + '/' + Chain.s_dbFile, sqliteOptions);

                            case 12:
                                this.m_db = _context4.sent;

                                this.m_headerStorage = new block_1.HeaderStorage({
                                    logger: this.m_logger,
                                    blockHeaderType: this._getBlockHeaderType(),
                                    db: this.m_db,
                                    blockStorage: this.m_blockStorage
                                });
                                err = void 0;
                                _context4.next = 17;
                                return this.m_headerStorage.init();

                            case 17:
                                err = _context4.sent;

                                if (!err) {
                                    _context4.next = 20;
                                    break;
                                }

                                return _context4.abrupt("return", err);

                            case 20:
                                this.m_storageManager = new storage_1.StorageManager({
                                    path: path.join(dataDir, 'storage'),
                                    storageType: storage_2.SqliteStorage,
                                    logger: this.m_logger,
                                    headerStorage: this.m_headerStorage
                                });
                                _context4.next = 23;
                                return this.m_storageManager.init();

                            case 23:
                                err = _context4.sent;

                                if (!err) {
                                    _context4.next = 26;
                                    break;
                                }

                                return _context4.abrupt("return", err);

                            case 26:
                                this.m_state = ChainState.init;
                                return _context4.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 28:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function initComponents(_x2, _x3, _x4) {
                return _ref4.apply(this, arguments);
            }

            return initComponents;
        }()
    }, {
        key: "uninitComponents",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(this.m_state !== ChainState.init)) {
                                    _context5.next = 2;
                                    break;
                                }

                                return _context5.abrupt("return");

                            case 2:
                                this.m_storageManager.uninit();
                                delete this.m_storageManager;
                                this.m_headerStorage.uninit();
                                delete this.m_headerStorage;
                                _context5.next = 8;
                                return this.m_db.close();

                            case 8:
                                delete this.m_db;
                                this.m_blockStorage.uninit();
                                delete this.m_blockStorage;
                                delete this.m_handler;
                                delete this.m_dataDir;
                                this.m_state = ChainState.none;

                            case 14:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function uninitComponents() {
                return _ref5.apply(this, arguments);
            }

            return uninitComponents;
        }()
    }, {
        key: "_onCheckTypeOptions",
        value: function _onCheckTypeOptions(typeOptions) {
            return true;
        }
    }, {
        key: "_onCheckGlobalOptions",
        value: function _onCheckGlobalOptions(globalOptions) {
            if (util_2.isNullOrUndefined(globalOptions.txlivetime)) {
                globalOptions.txlivetime = 60 * 60;
            }
            return true;
        }
    }, {
        key: "parseInstanceOptions",
        value: function parseInstanceOptions(node, instanceOptions) {
            var value = (0, _create2.default)(null);
            value.node = node;
            return { err: error_code_1.ErrorCode.RESULT_OK, value: value };
        }
    }, {
        key: "initialize",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(instanceOptions) {
                var _this2 = this;

                var err, _instanceOptions, baseNode, node;

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (!(this.m_state !== ChainState.init)) {
                                    _context7.next = 3;
                                    break;
                                }

                                this.m_logger.error("chain initialize failed for hasn't initComponent");
                                return _context7.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_STATE);

                            case 3:
                                _context7.next = 5;
                                return this._loadGenesis();

                            case 5:
                                err = _context7.sent;

                                if (!err) {
                                    _context7.next = 8;
                                    break;
                                }

                                return _context7.abrupt("return", err);

                            case 8:
                                this.m_state = ChainState.syncing;
                                _instanceOptions = (0, _create2.default)(null);

                                (0, _assign2.default)(_instanceOptions, instanceOptions);
                                // 初始化时，要同步的peer数目，与这个数目的peer完成同步之后，才开始接收tx，挖矿等等
                                _instanceOptions.initializePeerCount = !util_2.isNullOrUndefined(instanceOptions.initializePeerCount) ? instanceOptions.initializePeerCount : 1;
                                // 初始化时，一次请求的最大header数目
                                _instanceOptions.headerReqLimit = !util_2.isNullOrUndefined(instanceOptions.headerReqLimit) ? instanceOptions.headerReqLimit : 2000;
                                // confirm数目，当块的depth超过这个值时，认为时绝对安全的；分叉超过这个depth的两个fork，无法自动合并回去
                                _instanceOptions.confirmDepth = !util_2.isNullOrUndefined(instanceOptions.confirmDepth) ? instanceOptions.confirmDepth : 6;
                                _instanceOptions.ignoreVerify = !util_2.isNullOrUndefined(instanceOptions.ignoreVerify) ? instanceOptions.ignoreVerify : 0;
                                this.m_instanceOptions = _instanceOptions;
                                this.m_pending = this._createPending();
                                this.m_pending.init();
                                baseNode = this._createChainNode();
                                node = new chain_node_1.ChainNode({
                                    node: baseNode,
                                    blockStorage: this.m_blockStorage,
                                    storageManager: this.m_storageManager
                                });

                                this.m_node = node;
                                this.m_node.on('blocks', function (params) {
                                    _this2._addPendingBlocks(params);
                                });
                                this.m_node.on('headers', function (params) {
                                    _this2._addPendingHeaders(params);
                                });
                                this.m_node.on('transactions', function (conn, transactions) {
                                    var _iteratorNormalCompletion = true;
                                    var _didIteratorError = false;
                                    var _iteratorError = undefined;

                                    try {
                                        for (var _iterator = (0, _getIterator3.default)(transactions), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                            var tx = _step.value;

                                            _this2._addTransaction(tx);
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
                                });
                                this.m_node.base.on('ban', function (remote) {
                                    _this2._onConnectionError(remote);
                                });
                                this.m_node.base.on('error', function (connRemotePeer) {
                                    _this2._onConnectionError(connRemotePeer);
                                });
                                _context7.next = 28;
                                return this._loadChain();

                            case 28:
                                err = _context7.sent;

                                if (!err) {
                                    _context7.next = 31;
                                    break;
                                }

                                return _context7.abrupt("return", err);

                            case 31:
                                _context7.next = 33;
                                return this._initialBlockDownload();

                            case 33:
                                err = _context7.sent;

                                if (!err) {
                                    _context7.next = 36;
                                    break;
                                }

                                return _context7.abrupt("return", err);

                            case 36:
                                _context7.next = 38;
                                return new _promise2.default(function () {
                                    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(resolve) {
                                        return _regenerator2.default.wrap(function _callee6$(_context6) {
                                            while (1) {
                                                switch (_context6.prev = _context6.next) {
                                                    case 0:
                                                        _this2.prependOnceListener('tipBlock', function () {
                                                            _this2.m_logger.info("chain initialized success, tip number: " + _this2.m_tip.number + " hash: " + _this2.m_tip.hash);
                                                            resolve(error_code_1.ErrorCode.RESULT_OK);
                                                        });

                                                    case 1:
                                                    case "end":
                                                        return _context6.stop();
                                                }
                                            }
                                        }, _callee6, _this2);
                                    }));

                                    return function (_x6) {
                                        return _ref7.apply(this, arguments);
                                    };
                                }());

                            case 38:
                                err = _context7.sent;

                                if (!err) {
                                    _context7.next = 41;
                                    break;
                                }

                                return _context7.abrupt("return", err);

                            case 41:
                                _context7.next = 43;
                                return this.m_node.listen();

                            case 43:
                                err = _context7.sent;

                                if (!err) {
                                    _context7.next = 46;
                                    break;
                                }

                                return _context7.abrupt("return", err);

                            case 46:
                                return _context7.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 47:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function initialize(_x5) {
                return _ref6.apply(this, arguments);
            }

            return initialize;
        }()
    }, {
        key: "uninitialize",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, s;

                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (!(this.m_state <= ChainState.init)) {
                                    _context8.next = 2;
                                    break;
                                }

                                return _context8.abrupt("return");

                            case 2:
                                _context8.next = 4;
                                return this.m_node.uninit();

                            case 4:
                                delete this.m_node;
                                this.m_pending.uninit();
                                delete this.m_pending;
                                delete this.m_globalOptions;
                                delete this.m_instanceOptions;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context8.prev = 12;
                                for (_iterator2 = (0, _getIterator3.default)(this.m_constSnapshots); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    s = _step2.value;

                                    this.m_storageManager.releaseSnapshotView(s);
                                }
                                _context8.next = 20;
                                break;

                            case 16:
                                _context8.prev = 16;
                                _context8.t0 = _context8["catch"](12);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context8.t0;

                            case 20:
                                _context8.prev = 20;
                                _context8.prev = 21;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 23:
                                _context8.prev = 23;

                                if (!_didIteratorError2) {
                                    _context8.next = 26;
                                    break;
                                }

                                throw _iteratorError2;

                            case 26:
                                return _context8.finish(23);

                            case 27:
                                return _context8.finish(20);

                            case 28:
                                this.m_state = ChainState.init;

                            case 29:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[12, 16, 20, 28], [21,, 23, 27]]);
            }));

            function uninitialize() {
                return _ref8.apply(this, arguments);
            }

            return uninitialize;
        }()
    }, {
        key: "_createPending",
        value: function _createPending() {
            return new pending_1.PendingTransactions({ storageManager: this.m_storageManager, logger: this.logger, txlivetime: this.m_globalOptions.txlivetime });
        }
    }, {
        key: "_createChainNode",
        value: function _createChainNode() {
            return new block_1.RandomOutNode({
                node: this.m_instanceOptions.node,
                minOutbound: !util_2.isNullOrUndefined(this.m_instanceOptions.minOutbound) ? this.m_instanceOptions.minOutbound : 8,
                checkCycle: this.m_instanceOptions.connectionCheckCycle ? this.m_instanceOptions.connectionCheckCycle : 1000,
                dataDir: this.m_dataDir,
                logger: this.m_logger,
                headerStorage: this.m_headerStorage,
                blockHeaderType: this._getBlockHeaderType(),
                transactionType: this._getTransactionType()
            });
        }
    }, {
        key: "_loadChain",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                var result, err;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                assert(this.m_headerStorage);
                                assert(this.m_blockStorage);
                                _context9.next = 4;
                                return this.m_headerStorage.getHeader('latest');

                            case 4:
                                result = _context9.sent;
                                err = result.err;

                                if (!(err || !result.header)) {
                                    _context9.next = 8;
                                    break;
                                }

                                return _context9.abrupt("return", err);

                            case 8:
                                _context9.next = 10;
                                return this._updateTip(result.header);

                            case 10:
                                err = _context9.sent;

                                if (!err) {
                                    _context9.next = 13;
                                    break;
                                }

                                return _context9.abrupt("return", err);

                            case 13:
                                this.m_logger.info("load chain tip from disk, height:" + this.m_tip.number + ", hash:" + this.m_tip.hash);
                                return _context9.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 15:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function _loadChain() {
                return _ref9.apply(this, arguments);
            }

            return _loadChain;
        }()
    }, {
        key: "_updateTip",
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(tip) {
                var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, blockHash, gsv, mork, hr, err;

                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                this.m_tip = tip;
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context10.prev = 4;
                                for (_iterator3 = (0, _getIterator3.default)(this.m_refSnapshots); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    blockHash = _step3.value;

                                    this.m_storageManager.releaseSnapshotView(blockHash);
                                }
                                _context10.next = 12;
                                break;

                            case 8:
                                _context10.prev = 8;
                                _context10.t0 = _context10["catch"](4);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context10.t0;

                            case 12:
                                _context10.prev = 12;
                                _context10.prev = 13;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 15:
                                _context10.prev = 15;

                                if (!_didIteratorError3) {
                                    _context10.next = 18;
                                    break;
                                }

                                throw _iteratorError3;

                            case 18:
                                return _context10.finish(15);

                            case 19:
                                return _context10.finish(12);

                            case 20:
                                this.m_refSnapshots = [];
                                _context10.next = 23;
                                return this.m_storageManager.getSnapshotView(tip.hash);

                            case 23:
                                gsv = _context10.sent;

                                if (!gsv.err) {
                                    _context10.next = 26;
                                    break;
                                }

                                return _context10.abrupt("return", gsv.err);

                            case 26:
                                this.m_refSnapshots.push(tip.hash);
                                mork = tip.number - 2 * this._confirmDepth;

                                mork = mork >= 0 ? mork : 0;

                                if (!(mork !== tip.number)) {
                                    _context10.next = 41;
                                    break;
                                }

                                _context10.next = 32;
                                return this.m_headerStorage.getHeader(mork);

                            case 32:
                                hr = _context10.sent;

                                if (!hr.err) {
                                    _context10.next = 35;
                                    break;
                                }

                                return _context10.abrupt("return", hr.err);

                            case 35:
                                _context10.next = 37;
                                return this.m_storageManager.getSnapshotView(hr.header.hash);

                            case 37:
                                gsv = _context10.sent;

                                if (!gsv.err) {
                                    _context10.next = 40;
                                    break;
                                }

                                return _context10.abrupt("return", gsv.err);

                            case 40:
                                this.m_refSnapshots.push(hr.header.hash);

                            case 41:
                                this.m_storageManager.recycleSnapShot();
                                _context10.next = 44;
                                return this.m_pending.updateTipBlock(tip);

                            case 44:
                                err = _context10.sent;

                                if (!err) {
                                    _context10.next = 47;
                                    break;
                                }

                                return _context10.abrupt("return", err);

                            case 47:
                                return _context10.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 48:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[4, 8, 12, 20], [13,, 15, 19]]);
            }));

            function _updateTip(_x7) {
                return _ref10.apply(this, arguments);
            }

            return _updateTip;
        }()
    }, {
        key: "getBlock",
        value: function getBlock(hash) {
            return this.m_blockStorage.get(hash);
        }
    }, {
        key: "_addTransaction",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(tx) {
                var err;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                if (!(this.m_state !== ChainState.synced)) {
                                    _context11.next = 2;
                                    break;
                                }

                                return _context11.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_STATE);

                            case 2:
                                _context11.next = 4;
                                return this.m_pending.addTransaction(tx);

                            case 4:
                                err = _context11.sent;

                                // TODO: 广播要排除tx的来源 
                                if (!err) {
                                    this.logger.debug("broadcast transaction txhash=" + tx.hash + ", nonce=" + tx.hash + ", address=" + tx.address);
                                    this.m_node.broadcast([tx]);
                                }
                                return _context11.abrupt("return", err);

                            case 7:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function _addTransaction(_x8) {
                return _ref11.apply(this, arguments);
            }

            return _addTransaction;
        }()
    }, {
        key: "_compareWork",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(left, right) {
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, result: left.number - right.number });

                            case 1:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function _compareWork(_x9, _x10) {
                return _ref12.apply(this, arguments);
            }

            return _compareWork;
        }()
    }, {
        key: "_addPendingHeaders",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(params) {
                var _params;

                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                // TODO: 这里可以和pending block一样优化，去重已经有的
                                this.m_pendingHeaders.push(params);

                                if (!(this.m_pendingHeaders.length === 1)) {
                                    _context13.next = 9;
                                    break;
                                }

                            case 2:
                                if (!this.m_pendingHeaders.length) {
                                    _context13.next = 9;
                                    break;
                                }

                                _params = this.m_pendingHeaders[0];
                                _context13.next = 6;
                                return this._addHeaders(_params);

                            case 6:
                                this.m_pendingHeaders.shift();
                                _context13.next = 2;
                                break;

                            case 9:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function _addPendingHeaders(_x11) {
                return _ref13.apply(this, arguments);
            }

            return _addPendingHeaders;
        }()
    }, {
        key: "_addPendingBlocks",
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(params) {
                var head = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                var pendingBlocks, _pendingBlocks$adding, block, remote, storage, redoLog;

                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                pendingBlocks = this.m_pendingBlocks;

                                if (!pendingBlocks.hashes.has(params.block.hash)) {
                                    _context14.next = 3;
                                    break;
                                }

                                return _context14.abrupt("return");

                            case 3:
                                if (head) {
                                    pendingBlocks.sequence.unshift(params);
                                } else {
                                    pendingBlocks.sequence.push(params);
                                }
                                pendingBlocks.hashes.add(params.block.hash);

                                if (pendingBlocks.adding) {
                                    _context14.next = 15;
                                    break;
                                }

                            case 6:
                                if (!pendingBlocks.sequence.length) {
                                    _context14.next = 15;
                                    break;
                                }

                                pendingBlocks.adding = pendingBlocks.sequence.shift();
                                _pendingBlocks$adding = pendingBlocks.adding, block = _pendingBlocks$adding.block, remote = _pendingBlocks$adding.remote, storage = _pendingBlocks$adding.storage, redoLog = _pendingBlocks$adding.redoLog;
                                _context14.next = 11;
                                return this._addBlock(block, { remote: remote, storage: storage, redoLog: redoLog });

                            case 11:
                                pendingBlocks.hashes.delete(block.hash);
                                delete pendingBlocks.adding;
                                _context14.next = 6;
                                break;

                            case 15:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function _addPendingBlocks(_x12) {
                return _ref14.apply(this, arguments);
            }

            return _addPendingBlocks;
        }()
    }, {
        key: "_onConnectionError",
        value: function _onConnectionError(remote) {
            this.m_connSyncMap.delete(remote);
            var hi = 1;
            while (true) {
                if (hi >= this.m_pendingHeaders.length) {
                    break;
                }
                if (this.m_pendingHeaders[hi].remote === remote) {
                    this.m_pendingHeaders.splice(hi, 1);
                } else {
                    ++hi;
                }
            }
            var bi = 1;
            var pendingBlocks = this.m_pendingBlocks;
            while (true) {
                if (bi >= pendingBlocks.sequence.length) {
                    break;
                }
                var params = pendingBlocks.sequence[hi];
                if (params.remote === remote) {
                    pendingBlocks.sequence.splice(bi, 1);
                    pendingBlocks.hashes.delete(params.block.hash);
                } else {
                    ++bi;
                }
            }
        }
    }, {
        key: "_banConnection",
        value: function _banConnection(remote, level) {
            var connSync = void 0;
            if (typeof remote === 'string') {
                connSync = this.m_connSyncMap.get(remote);
                if (!connSync) {
                    return error_code_1.ErrorCode.RESULT_NOT_FOUND;
                }
                this.m_node.base.banConnection(remote, level);
            } else {
                connSync = remote;
                this.m_node.base.banConnection(connSync.conn.getRemote(), level);
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_continueSyncWithConnection",
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(from) {
                var connSync, limit, syncedCount, out, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, conn, _connSync;

                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                connSync = void 0;

                                if (!(typeof from === 'string')) {
                                    _context15.next = 7;
                                    break;
                                }

                                connSync = this.m_connSyncMap.get(from);

                                if (connSync) {
                                    _context15.next = 5;
                                    break;
                                }

                                return _context15.abrupt("return", error_code_1.ErrorCode.RESULT_NOT_FOUND);

                            case 5:
                                _context15.next = 8;
                                break;

                            case 7:
                                connSync = from;

                            case 8:
                                if (!connSync.moreHeaders) {
                                    _context15.next = 17;
                                    break;
                                }

                                connSync.lastRequestHeader = connSync.lastRecvHeader.hash;
                                _context15.next = 12;
                                return this._calcuteReqLimit(connSync.lastRequestHeader, this._headerReqLimit);

                            case 12:
                                limit = _context15.sent;

                                connSync.reqLimit = limit;
                                this.m_node.requestHeaders(connSync.conn, { from: connSync.lastRecvHeader.hash, limit: limit });
                                _context15.next = 42;
                                break;

                            case 17:
                                connSync.state = ChainState.synced;
                                delete connSync.moreHeaders;

                                if (!(this.m_state === ChainState.syncing)) {
                                    _context15.next = 42;
                                    break;
                                }

                                syncedCount = 0;
                                out = this.m_node.base.node.getOutbounds();
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context15.prev = 25;

                                for (_iterator4 = (0, _getIterator3.default)(out); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    conn = _step4.value;
                                    _connSync = this.m_connSyncMap.get(conn.getRemote());

                                    if (_connSync && _connSync.state === ChainState.synced) {
                                        ++syncedCount;
                                    }
                                }
                                _context15.next = 33;
                                break;

                            case 29:
                                _context15.prev = 29;
                                _context15.t0 = _context15["catch"](25);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context15.t0;

                            case 33:
                                _context15.prev = 33;
                                _context15.prev = 34;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 36:
                                _context15.prev = 36;

                                if (!_didIteratorError4) {
                                    _context15.next = 39;
                                    break;
                                }

                                throw _iteratorError4;

                            case 39:
                                return _context15.finish(36);

                            case 40:
                                return _context15.finish(33);

                            case 41:
                                if (syncedCount >= this._initializePeerCount) {
                                    this.m_state = ChainState.synced;
                                    this.logger.debug("emit tipBlock with " + this.m_tip.hash + " " + this.m_tip.number);
                                    this.emit('tipBlock', this, this.m_tip);
                                }

                            case 42:
                                return _context15.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 43:
                            case "end":
                                return _context15.stop();
                        }
                    }
                }, _callee15, this, [[25, 29, 33, 41], [34,, 36, 40]]);
            }));

            function _continueSyncWithConnection(_x14) {
                return _ref15.apply(this, arguments);
            }

            return _continueSyncWithConnection;
        }()
    }, {
        key: "_createSyncedConnection",
        value: function _createSyncedConnection(from) {
            var conn = this.m_node.base.node.getConnection(from);
            if (!conn) {
                return { err: error_code_1.ErrorCode.RESULT_NOT_FOUND };
            }
            var connSync = { state: ChainState.synced, conn: conn, reqLimit: this._headerReqLimit };
            this.m_connSyncMap.set(from, connSync);
            return { err: error_code_1.ErrorCode.RESULT_OK, connSync: connSync };
        }
    }, {
        key: "_beginSyncWithConnection",
        value: function () {
            var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(from, fromHeader) {
                var connSync, conn, limit;
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                connSync = void 0;

                                if (!(typeof from === 'string')) {
                                    _context16.next = 11;
                                    break;
                                }

                                connSync = this.m_connSyncMap.get(from);

                                if (connSync) {
                                    _context16.next = 9;
                                    break;
                                }

                                conn = this.m_node.base.node.getConnection(from);

                                if (conn) {
                                    _context16.next = 7;
                                    break;
                                }

                                return _context16.abrupt("return", error_code_1.ErrorCode.RESULT_NOT_FOUND);

                            case 7:
                                connSync = { state: ChainState.syncing, conn: conn, reqLimit: this._headerReqLimit };
                                this.m_connSyncMap.set(from, connSync);

                            case 9:
                                _context16.next = 12;
                                break;

                            case 11:
                                connSync = from;

                            case 12:
                                connSync.state = ChainState.syncing;
                                connSync.lastRequestHeader = fromHeader;
                                _context16.next = 16;
                                return this._calcuteReqLimit(fromHeader, this._headerReqLimit);

                            case 16:
                                limit = _context16.sent;

                                connSync.reqLimit = limit;
                                this.m_node.requestHeaders(connSync.conn, { from: fromHeader, limit: limit });
                                return _context16.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 20:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function _beginSyncWithConnection(_x15, _x16) {
                return _ref16.apply(this, arguments);
            }

            return _beginSyncWithConnection;
        }()
    }, {
        key: "_calcuteReqLimit",
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(fromHeader, limit) {
                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                return _context17.abrupt("return", limit);

                            case 1:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function _calcuteReqLimit(_x17, _x18) {
                return _ref17.apply(this, arguments);
            }

            return _calcuteReqLimit;
        }()
    }, {
        key: "_verifyAndSaveHeaders",
        value: function () {
            var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(headers) {
                var hr, toSave, toRequest, ix, header, result, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _header, _ref19, err, valid, saveRet;

                return _regenerator2.default.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                assert(this.m_headerStorage);
                                _context18.next = 3;
                                return this.m_headerStorage.getHeader(headers[0].preBlockHash);

                            case 3:
                                hr = _context18.sent;

                                if (!hr.err) {
                                    _context18.next = 6;
                                    break;
                                }

                                return _context18.abrupt("return", { err: hr.err });

                            case 6:
                                toSave = [];
                                toRequest = [];
                                ix = 0;

                            case 9:
                                if (!(ix < headers.length)) {
                                    _context18.next = 32;
                                    break;
                                }

                                header = headers[ix];
                                _context18.next = 13;
                                return this.m_headerStorage.getHeader(header.hash);

                            case 13:
                                result = _context18.sent;

                                if (!result.err) {
                                    _context18.next = 23;
                                    break;
                                }

                                if (!(result.err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context18.next = 20;
                                    break;
                                }

                                toSave = headers.slice(ix);
                                return _context18.abrupt("break", 32);

                            case 20:
                                return _context18.abrupt("return", { err: result.err });

                            case 21:
                                _context18.next = 29;
                                break;

                            case 23:
                                if (!(result.verified === block_1.VERIFY_STATE.notVerified)) {
                                    _context18.next = 27;
                                    break;
                                }

                                // 已经认证过的block就不要再请求了
                                toRequest.push(header);
                                _context18.next = 29;
                                break;

                            case 27:
                                if (!(result.verified === block_1.VERIFY_STATE.invalid)) {
                                    _context18.next = 29;
                                    break;
                                }

                                return _context18.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_BLOCK });

                            case 29:
                                ++ix;
                                _context18.next = 9;
                                break;

                            case 32:
                                toRequest.push.apply(toRequest, (0, _toConsumableArray3.default)(toSave));
                                assert(this.m_tip);
                                _iteratorNormalCompletion5 = true;
                                _didIteratorError5 = false;
                                _iteratorError5 = undefined;
                                _context18.prev = 37;
                                _iterator5 = (0, _getIterator3.default)(toSave);

                            case 39:
                                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                                    _context18.next = 58;
                                    break;
                                }

                                _header = _step5.value;
                                _context18.next = 43;
                                return _header.verify(this);

                            case 43:
                                _ref19 = _context18.sent;
                                err = _ref19.err;
                                valid = _ref19.valid;

                                if (!err) {
                                    _context18.next = 48;
                                    break;
                                }

                                return _context18.abrupt("return", { err: err });

                            case 48:
                                if (valid) {
                                    _context18.next = 50;
                                    break;
                                }

                                return _context18.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_BLOCK });

                            case 50:
                                _context18.next = 52;
                                return this.m_headerStorage.saveHeader(_header);

                            case 52:
                                saveRet = _context18.sent;

                                if (!saveRet) {
                                    _context18.next = 55;
                                    break;
                                }

                                return _context18.abrupt("return", { err: saveRet });

                            case 55:
                                _iteratorNormalCompletion5 = true;
                                _context18.next = 39;
                                break;

                            case 58:
                                _context18.next = 64;
                                break;

                            case 60:
                                _context18.prev = 60;
                                _context18.t0 = _context18["catch"](37);
                                _didIteratorError5 = true;
                                _iteratorError5 = _context18.t0;

                            case 64:
                                _context18.prev = 64;
                                _context18.prev = 65;

                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }

                            case 67:
                                _context18.prev = 67;

                                if (!_didIteratorError5) {
                                    _context18.next = 70;
                                    break;
                                }

                                throw _iteratorError5;

                            case 70:
                                return _context18.finish(67);

                            case 71:
                                return _context18.finish(64);

                            case 72:
                                return _context18.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, toRequest: toRequest });

                            case 73:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this, [[37, 60, 64, 72], [65,, 67, 71]]);
            }));

            function _verifyAndSaveHeaders(_x19) {
                return _ref18.apply(this, arguments);
            }

            return _verifyAndSaveHeaders;
        }()
    }, {
        key: "_addHeaders",
        value: function () {
            var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(params) {
                var remote, headers, request, error, connSync, cr, vsh, hsr, _vsh, _hsr;

                return _regenerator2.default.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                remote = params.remote, headers = params.headers, request = params.request, error = params.error;
                                connSync = this.m_connSyncMap.get(remote);

                                if (!(request && !connSync)) {
                                    _context19.next = 4;
                                    break;
                                }

                                return _context19.abrupt("return", error_code_1.ErrorCode.RESULT_NOT_FOUND);

                            case 4:
                                if (connSync) {
                                    _context19.next = 9;
                                    break;
                                }

                                // 广播过来的可能没有请求过header，此时创建conn sync
                                cr = this._createSyncedConnection(remote);

                                if (!cr.err) {
                                    _context19.next = 8;
                                    break;
                                }

                                return _context19.abrupt("return", cr.err);

                            case 8:
                                connSync = cr.connSync;

                            case 9:
                                if (!(connSync.state === ChainState.syncing)) {
                                    _context19.next = 65;
                                    break;
                                }

                                if (!(request && request.from)) {
                                    _context19.next = 62;
                                    break;
                                }

                                if (!(request.from !== connSync.lastRequestHeader)) {
                                    _context19.next = 15;
                                    break;
                                }

                                this.m_logger.error("request " + connSync.lastRequestHeader + " from " + remote + " while got headers from " + request.from);
                                this._banConnection(remote, block_1.BAN_LEVEL.forever);
                                return _context19.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 15:
                                if (!(error === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context19.next = 41;
                                    break;
                                }

                                if (headers.length) {
                                    _context19.next = 19;
                                    break;
                                }

                                this._banConnection(remote, block_1.BAN_LEVEL.forever);
                                return _context19.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 19:
                                this.m_logger.info("get headers [" + headers[0].hash + ", " + headers[headers.length - 1].hash + "] from " + remote + " at syncing");
                                _context19.next = 22;
                                return this._verifyAndSaveHeaders(headers);

                            case 22:
                                vsh = _context19.sent;

                                if (!(vsh.err === error_code_1.ErrorCode.RESULT_NOT_FOUND || vsh.err === error_code_1.ErrorCode.RESULT_INVALID_BLOCK)) {
                                    _context19.next = 28;
                                    break;
                                }

                                this._banConnection(remote, block_1.BAN_LEVEL.forever);
                                return _context19.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 28:
                                if (!vsh.err) {
                                    _context19.next = 30;
                                    break;
                                }

                                return _context19.abrupt("return", vsh.err);

                            case 30:
                                connSync.lastRecvHeader = headers[headers.length - 1];
                                connSync.moreHeaders = headers.length === connSync.reqLimit;

                                if (!vsh.toRequest.length) {
                                    _context19.next = 36;
                                    break;
                                }

                                // 向conn 发出block请求
                                // 如果options.redoLog=1 同时也请求redo log内容, redo log 会随着block package 一起返回
                                this.m_node.requestBlocks({
                                    headers: vsh.toRequest,
                                    redoLog: this._ignoreVerify
                                }, remote);
                                _context19.next = 39;
                                break;

                            case 36:
                                _context19.next = 38;
                                return this._continueSyncWithConnection(connSync);

                            case 38:
                                return _context19.abrupt("return", _context19.sent);

                            case 39:
                                _context19.next = 60;
                                break;

                            case 41:
                                if (!(error === error_code_1.ErrorCode.RESULT_SKIPPED)) {
                                    _context19.next = 48;
                                    break;
                                }

                                // 没有更多了
                                connSync.moreHeaders = false;
                                // 继续同步header回来
                                _context19.next = 45;
                                return this._continueSyncWithConnection(connSync);

                            case 45:
                                return _context19.abrupt("return", _context19.sent);

                            case 48:
                                if (!(error === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context19.next = 59;
                                    break;
                                }

                                _context19.next = 51;
                                return this.getHeader(connSync.lastRequestHeader, -this._headerReqLimit);

                            case 51:
                                hsr = _context19.sent;

                                if (!hsr.err) {
                                    _context19.next = 54;
                                    break;
                                }

                                return _context19.abrupt("return", hsr.err);

                            case 54:
                                _context19.next = 56;
                                return this._beginSyncWithConnection(connSync, hsr.header.hash);

                            case 56:
                                return _context19.abrupt("return", _context19.sent);

                            case 59:
                                assert(false, "get header with syncing from " + remote + " with err " + error);

                            case 60:
                                _context19.next = 63;
                                break;

                            case 62:
                                if (!request) {
                                    // 广播来的直接忽略
                                } else {
                                    this.m_logger.error("invalid header request " + request + " response when syncing with " + remote);
                                    this._banConnection(remote, block_1.BAN_LEVEL.forever);
                                }

                            case 63:
                                _context19.next = 95;
                                break;

                            case 65:
                                if (!(connSync.state === ChainState.synced)) {
                                    _context19.next = 95;
                                    break;
                                }

                                if (request) {
                                    _context19.next = 93;
                                    break;
                                }

                                this.m_logger.info("get headers [" + headers[0].hash + ", " + headers[headers.length - 1].hash + "] from " + remote + " at synced");
                                _context19.next = 70;
                                return this._verifyAndSaveHeaders(headers);

                            case 70:
                                _vsh = _context19.sent;

                                if (!(_vsh.err === error_code_1.ErrorCode.RESULT_INVALID_BLOCK)) {
                                    _context19.next = 76;
                                    break;
                                }

                                this._banConnection(remote, block_1.BAN_LEVEL.day);
                                return _context19.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 76:
                                if (!(_vsh.err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context19.next = 87;
                                    break;
                                }

                                _context19.next = 79;
                                return this.getHeader(this.m_tip, -this._confirmDepth + 1);

                            case 79:
                                _hsr = _context19.sent;

                                if (!_hsr.err) {
                                    _context19.next = 82;
                                    break;
                                }

                                return _context19.abrupt("return", _hsr.err);

                            case 82:
                                _context19.next = 84;
                                return this._beginSyncWithConnection(connSync, _hsr.header.hash);

                            case 84:
                                return _context19.abrupt("return", _context19.sent);

                            case 87:
                                if (!_vsh.err) {
                                    _context19.next = 89;
                                    break;
                                }

                                return _context19.abrupt("return", _vsh.err);

                            case 89:
                                connSync.lastRecvHeader = headers[headers.length - 1];
                                this.m_node.requestBlocks({ headers: _vsh.toRequest }, remote);
                                _context19.next = 95;
                                break;

                            case 93:
                                // 不是广播来来的都不对
                                this.m_logger.error("invalid header request " + request + " response when synced with " + remote);
                                this._banConnection(remote, block_1.BAN_LEVEL.forever);

                            case 95:
                                return _context19.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 96:
                            case "end":
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function _addHeaders(_x20) {
                return _ref20.apply(this, arguments);
            }

            return _addHeaders;
        }()
    }, {
        key: "_addBlock",
        value: function () {
            var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(block, options) {
                var _this3 = this;

                var err, _err, headerResult, vbr, _err2, _err3, syncing, synced, broadcastExcept, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, remote, connSync, hr, nextResult, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, result, _block;

                return _regenerator2.default.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                // try{
                                assert(this.m_headerStorage);
                                this.m_logger.info("begin adding block number: " + block.number + "  hash: " + block.hash + " to chain ");
                                err = error_code_1.ErrorCode.RESULT_OK;

                                if (!options.storage) {
                                    _context20.next = 11;
                                    break;
                                }

                                _context20.next = 6;
                                return this._addVerifiedBlock(block, options.storage);

                            case 6:
                                _err = _context20.sent;

                                if (!_err) {
                                    _context20.next = 9;
                                    break;
                                }

                                return _context20.abrupt("return", _err);

                            case 9:
                                _context20.next = 71;
                                break;

                            case 11:
                                _context20.next = 13;
                                return this.m_headerStorage.getHeader(block.hash);

                            case 13:
                                headerResult = _context20.sent;

                                if (!headerResult.err) {
                                    _context20.next = 19;
                                    break;
                                }

                                this.m_logger.warn("ignore block for header missing");
                                err = headerResult.err;
                                if (err === error_code_1.ErrorCode.RESULT_NOT_FOUND) {
                                    err = error_code_1.ErrorCode.RESULT_INVALID_BLOCK;
                                }
                                return _context20.abrupt("break", 44);

                            case 19:
                                assert(headerResult.header && headerResult.verified !== undefined);

                                if (!(headerResult.verified === block_1.VERIFY_STATE.verified || headerResult.verified === block_1.VERIFY_STATE.invalid)) {
                                    _context20.next = 24;
                                    break;
                                }

                                this.m_logger.info("ignore block for block has been verified as " + headerResult.verified);
                                if (headerResult.verified === block_1.VERIFY_STATE.invalid) {
                                    err = error_code_1.ErrorCode.RESULT_INVALID_BLOCK;
                                } else {
                                    err = error_code_1.ErrorCode.RESULT_SKIPPED;
                                }
                                return _context20.abrupt("break", 44);

                            case 24:
                                _context20.next = 26;
                                return this.m_headerStorage.getHeader(block.header.preBlockHash);

                            case 26:
                                headerResult = _context20.sent;

                                if (!headerResult.err) {
                                    _context20.next = 31;
                                    break;
                                }

                                this.m_logger.warn("ignore block for previous header hash: " + block.header.preBlockHash + " missing");
                                err = headerResult.err;
                                return _context20.abrupt("break", 44);

                            case 31:
                                assert(headerResult.header && headerResult.verified !== undefined);

                                if (!(headerResult.verified === block_1.VERIFY_STATE.notVerified)) {
                                    _context20.next = 38;
                                    break;
                                }

                                this.m_logger.info("ignore block for previous header hash: " + block.header.preBlockHash + " hasn't been verified");
                                err = error_code_1.ErrorCode.RESULT_SKIPPED;
                                return _context20.abrupt("break", 44);

                            case 38:
                                if (!(headerResult.verified === block_1.VERIFY_STATE.invalid)) {
                                    _context20.next = 43;
                                    break;
                                }

                                this.m_logger.info("ignore block for previous block has been verified as invalid");
                                this.m_headerStorage.updateVerified(block.header, block_1.VERIFY_STATE.invalid);
                                err = error_code_1.ErrorCode.RESULT_INVALID_BLOCK;
                                return _context20.abrupt("break", 44);

                            case 43:
                                if (false) {
                                    _context20.next = 11;
                                    break;
                                }

                            case 44:
                                if (!(err === error_code_1.ErrorCode.RESULT_INVALID_BLOCK)) {
                                    _context20.next = 49;
                                    break;
                                }

                                if (options.remote) {
                                    this._banConnection(options.remote, block_1.BAN_LEVEL.day);
                                }
                                return _context20.abrupt("return", err);

                            case 49:
                                if (!(err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context20.next = 51;
                                    break;
                                }

                                return _context20.abrupt("return", err);

                            case 51:
                                _context20.next = 53;
                                return this.verifyBlock(block, { redoLog: options.redoLog });

                            case 53:
                                vbr = _context20.sent;

                                if (!vbr.err) {
                                    _context20.next = 57;
                                    break;
                                }

                                this.m_logger.error("add block failed for verify failed for " + vbr.err);
                                return _context20.abrupt("return", vbr.err);

                            case 57:
                                if (vbr.verified) {
                                    _context20.next = 66;
                                    break;
                                }

                                if (options.remote) {
                                    this._banConnection(options.remote, block_1.BAN_LEVEL.day);
                                }
                                _context20.next = 61;
                                return this.m_headerStorage.updateVerified(block.header, block_1.VERIFY_STATE.invalid);

                            case 61:
                                _err2 = _context20.sent;

                                if (!_err2) {
                                    _context20.next = 64;
                                    break;
                                }

                                return _context20.abrupt("return", _err2);

                            case 64:
                                _context20.next = 71;
                                break;

                            case 66:
                                _context20.next = 68;
                                return this._addVerifiedBlock(block, vbr.storage);

                            case 68:
                                _err3 = _context20.sent;

                                if (!_err3) {
                                    _context20.next = 71;
                                    break;
                                }

                                return _context20.abrupt("return", _err3);

                            case 71:
                                syncing = false;
                                synced = false;
                                broadcastExcept = new _set2.default();
                                _iteratorNormalCompletion6 = true;
                                _didIteratorError6 = false;
                                _iteratorError6 = undefined;
                                _context20.prev = 77;
                                _iterator6 = (0, _getIterator3.default)(this.m_connSyncMap.keys());

                            case 79:
                                if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                                    _context20.next = 94;
                                    break;
                                }

                                remote = _step6.value;
                                connSync = this.m_connSyncMap.get(remote);

                                if (!(connSync.state === ChainState.syncing)) {
                                    _context20.next = 90;
                                    break;
                                }

                                if (!(connSync.lastRecvHeader && connSync.lastRecvHeader.hash === block.hash)) {
                                    _context20.next = 87;
                                    break;
                                }

                                _context20.next = 86;
                                return this._continueSyncWithConnection(connSync);

                            case 86:
                                syncing = true;

                            case 87:
                                broadcastExcept.add(remote);
                                _context20.next = 91;
                                break;

                            case 90:
                                if (connSync.lastRecvHeader && connSync.lastRecvHeader.hash === block.hash) {
                                    synced = true;
                                    broadcastExcept.add(remote);
                                }

                            case 91:
                                _iteratorNormalCompletion6 = true;
                                _context20.next = 79;
                                break;

                            case 94:
                                _context20.next = 100;
                                break;

                            case 96:
                                _context20.prev = 96;
                                _context20.t0 = _context20["catch"](77);
                                _didIteratorError6 = true;
                                _iteratorError6 = _context20.t0;

                            case 100:
                                _context20.prev = 100;
                                _context20.prev = 101;

                                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                    _iterator6.return();
                                }

                            case 103:
                                _context20.prev = 103;

                                if (!_didIteratorError6) {
                                    _context20.next = 106;
                                    break;
                                }

                                throw _iteratorError6;

                            case 106:
                                return _context20.finish(103);

                            case 107:
                                return _context20.finish(100);

                            case 108:
                                if (!(options.storage || !syncing && synced)) {
                                    _context20.next = 122;
                                    break;
                                }

                                if (!(this.m_tip.hash === block.header.hash)) {
                                    _context20.next = 122;
                                    break;
                                }

                                this.logger.debug("emit tipBlock with " + this.m_tip.hash + " " + this.m_tip.number);
                                this.emit('tipBlock', this, this.m_tip);
                                // 在broadcast之前执行一次recycleSnapShot
                                this.m_storageManager.recycleSnapShot();
                                _context20.next = 115;
                                return this.getHeader(this.m_tip, -this._broadcastDepth);

                            case 115:
                                hr = _context20.sent;

                                if (!hr.err) {
                                    _context20.next = 118;
                                    break;
                                }

                                return _context20.abrupt("return", hr.err);

                            case 118:
                                assert(hr.headers);
                                if (hr.headers[0].number === 0) {
                                    hr.headers = hr.headers.slice(1);
                                }
                                this.m_node.broadcast(hr.headers, { filter: function filter(conn) {
                                        _this3.m_logger.debug("broadcast to " + conn.getRemote() + ": " + !broadcastExcept.has(conn.getRemote()));
                                        return !broadcastExcept.has(conn.getRemote());
                                    } });
                                this.m_logger.info("broadcast tip headers from number: " + hr.headers[0].number + " hash: " + hr.headers[0].hash + " to number: " + this.m_tip.number + " hash: " + this.m_tip.hash);

                            case 122:
                                _context20.next = 124;
                                return this.m_headerStorage.getNextHeader(block.header.hash);

                            case 124:
                                nextResult = _context20.sent;

                                if (!nextResult.err) {
                                    _context20.next = 131;
                                    break;
                                }

                                if (!(nextResult.err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context20.next = 130;
                                    break;
                                }

                                return _context20.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 130:
                                return _context20.abrupt("return", nextResult.err);

                            case 131:
                                assert(nextResult.results && nextResult.results.length);
                                _iteratorNormalCompletion7 = true;
                                _didIteratorError7 = false;
                                _iteratorError7 = undefined;
                                _context20.prev = 135;
                                for (_iterator7 = (0, _getIterator3.default)(nextResult.results); !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                    result = _step7.value;
                                    _block = this.m_blockStorage.get(result.header.hash);

                                    if (_block) {
                                        this.m_logger.info("next block hash " + result.header.hash + " is ready");
                                        this._addPendingBlocks({ block: _block }, true);
                                    }
                                }
                                _context20.next = 143;
                                break;

                            case 139:
                                _context20.prev = 139;
                                _context20.t1 = _context20["catch"](135);
                                _didIteratorError7 = true;
                                _iteratorError7 = _context20.t1;

                            case 143:
                                _context20.prev = 143;
                                _context20.prev = 144;

                                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                    _iterator7.return();
                                }

                            case 146:
                                _context20.prev = 146;

                                if (!_didIteratorError7) {
                                    _context20.next = 149;
                                    break;
                                }

                                throw _iteratorError7;

                            case 149:
                                return _context20.finish(146);

                            case 150:
                                return _context20.finish(143);

                            case 151:
                                return _context20.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 152:
                            case "end":
                                return _context20.stop();
                        }
                    }
                }, _callee20, this, [[77, 96, 100, 108], [101,, 103, 107], [135, 139, 143, 151], [144,, 146, 150]]);
            }));

            function _addBlock(_x21, _x22) {
                return _ref21.apply(this, arguments);
            }

            return _addBlock;
        }()
    }, {
        key: "_addVerifiedBlock",
        value: function () {
            var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(block, storage) {
                var cr, err, _err4;

                return _regenerator2.default.wrap(function _callee21$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:
                                this.m_logger.info("begin add verified block to chain");
                                assert(this.m_headerStorage);
                                assert(this.m_tip);
                                _context21.next = 5;
                                return this._compareWork(block.header, this.m_tip);

                            case 5:
                                cr = _context21.sent;

                                if (!cr.err) {
                                    _context21.next = 8;
                                    break;
                                }

                                return _context21.abrupt("return", cr.err);

                            case 8:
                                if (!(cr.result > 0)) {
                                    _context21.next = 26;
                                    break;
                                }

                                this.m_logger.info("begin extend chain's tip");
                                _context21.next = 12;
                                return this.m_headerStorage.changeBest(block.header);

                            case 12:
                                err = _context21.sent;

                                if (!err) {
                                    _context21.next = 16;
                                    break;
                                }

                                this.m_logger.info("extend chain's tip failed for save to header storage failed for " + err);
                                return _context21.abrupt("return", err);

                            case 16:
                                _context21.next = 18;
                                return this._onVerifiedBlock(block);

                            case 18:
                                err = _context21.sent;
                                _context21.next = 21;
                                return this._updateTip(block.header);

                            case 21:
                                err = _context21.sent;

                                if (!err) {
                                    _context21.next = 24;
                                    break;
                                }

                                return _context21.abrupt("return", err);

                            case 24:
                                _context21.next = 32;
                                break;

                            case 26:
                                _context21.next = 28;
                                return this.m_headerStorage.updateVerified(block.header, block_1.VERIFY_STATE.verified);

                            case 28:
                                _err4 = _context21.sent;

                                if (!_err4) {
                                    _context21.next = 32;
                                    break;
                                }

                                this.m_logger.error("add verified block to chain failed for update verify state to header storage failed for " + _err4);
                                return _context21.abrupt("return", _err4);

                            case 32:
                                return _context21.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 33:
                            case "end":
                                return _context21.stop();
                        }
                    }
                }, _callee21, this);
            }));

            function _addVerifiedBlock(_x23, _x24) {
                return _ref22.apply(this, arguments);
            }

            return _addVerifiedBlock;
        }()
    }, {
        key: "_onVerifiedBlock",
        value: function () {
            var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22(block) {
                return _regenerator2.default.wrap(function _callee22$(_context22) {
                    while (1) {
                        switch (_context22.prev = _context22.next) {
                            case 0:
                                return _context22.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 1:
                            case "end":
                                return _context22.stop();
                        }
                    }
                }, _callee22, this);
            }));

            function _onVerifiedBlock(_x25) {
                return _ref23.apply(this, arguments);
            }

            return _onVerifiedBlock;
        }()
    }, {
        key: "newBlockHeader",
        value: function newBlockHeader() {
            return new (this._getBlockHeaderType())();
        }
    }, {
        key: "newBlock",
        value: function newBlock(header) {
            var block = new block_1.Block({
                header: header,
                headerType: this._getBlockHeaderType(),
                transactionType: this._getTransactionType()
            });
            return block;
        }
    }, {
        key: "newBlockExecutor",
        value: function () {
            var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23(block, storage) {
                var executor;
                return _regenerator2.default.wrap(function _callee23$(_context23) {
                    while (1) {
                        switch (_context23.prev = _context23.next) {
                            case 0:
                                executor = new executor_1.BlockExecutor({ logger: this.m_logger, block: block, storage: storage, handler: this.m_handler, externContext: {}, globalOptions: this.m_globalOptions });
                                return _context23.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, executor: executor });

                            case 2:
                            case "end":
                                return _context23.stop();
                        }
                    }
                }, _callee23, this);
            }));

            function newBlockExecutor(_x26, _x27) {
                return _ref24.apply(this, arguments);
            }

            return newBlockExecutor;
        }()
    }, {
        key: "newViewExecutor",
        value: function () {
            var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(header, storage, method, param) {
                var executor;
                return _regenerator2.default.wrap(function _callee24$(_context24) {
                    while (1) {
                        switch (_context24.prev = _context24.next) {
                            case 0:
                                executor = new executor_1.ViewExecutor({ logger: this.m_logger, header: header, storage: storage, method: method, param: param, handler: this.m_handler, externContext: {} });
                                return _context24.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, executor: executor });

                            case 2:
                            case "end":
                                return _context24.stop();
                        }
                    }
                }, _callee24, this);
            }));

            function newViewExecutor(_x28, _x29, _x30, _x31) {
                return _ref25.apply(this, arguments);
            }

            return newViewExecutor;
        }()
    }, {
        key: "getHeader",
        value: function () {
            var _ref26 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25(arg1, arg2) {
                return _regenerator2.default.wrap(function _callee25$(_context25) {
                    while (1) {
                        switch (_context25.prev = _context25.next) {
                            case 0:
                                _context25.next = 2;
                                return this.m_headerStorage.getHeader(arg1, arg2);

                            case 2:
                                return _context25.abrupt("return", _context25.sent);

                            case 3:
                            case "end":
                                return _context25.stop();
                        }
                    }
                }, _callee25, this);
            }));

            function getHeader(_x32, _x33) {
                return _ref26.apply(this, arguments);
            }

            return getHeader;
        }()
    }, {
        key: "_initialBlockDownload",
        value: function () {
            var _ref27 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27() {
                var _this4 = this;

                var err, tip;
                return _regenerator2.default.wrap(function _callee27$(_context27) {
                    while (1) {
                        switch (_context27.prev = _context27.next) {
                            case 0:
                                assert(this.m_node);
                                _context27.next = 3;
                                return this.m_node.init();

                            case 3:
                                err = _context27.sent;

                                if (!err) {
                                    _context27.next = 12;
                                    break;
                                }

                                if (!(err === error_code_1.ErrorCode.RESULT_SKIPPED)) {
                                    _context27.next = 11;
                                    break;
                                }

                                this.m_state = ChainState.synced;
                                this.logger.debug("emit tipBlock with " + this.m_tip.hash + " " + this.m_tip.number);
                                tip = this.m_tip;

                                (0, _setImmediate3.default)(function () {
                                    _this4.emit('tipBlock', _this4, tip);
                                });
                                return _context27.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 11:
                                return _context27.abrupt("return", err);

                            case 12:
                                this.m_node.base.on('outbound', function () {
                                    var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26(conn) {
                                        var syncPeer, hr;
                                        return _regenerator2.default.wrap(function _callee26$(_context26) {
                                            while (1) {
                                                switch (_context26.prev = _context26.next) {
                                                    case 0:
                                                        syncPeer = conn;

                                                        assert(syncPeer);
                                                        _context26.next = 4;
                                                        return _this4.m_headerStorage.getHeader(_this4.m_tip.number > _this4._confirmDepth ? _this4.m_tip.number - _this4._confirmDepth : 0);

                                                    case 4:
                                                        hr = _context26.sent;

                                                        if (!hr.err) {
                                                            _context26.next = 7;
                                                            break;
                                                        }

                                                        return _context26.abrupt("return", hr.err);

                                                    case 7:
                                                        assert(hr.header);
                                                        _context26.next = 10;
                                                        return _this4._beginSyncWithConnection(conn.getRemote(), hr.header.hash);

                                                    case 10:
                                                        return _context26.abrupt("return", _context26.sent);

                                                    case 11:
                                                    case "end":
                                                        return _context26.stop();
                                                }
                                            }
                                        }, _callee26, _this4);
                                    }));

                                    return function (_x34) {
                                        return _ref28.apply(this, arguments);
                                    };
                                }());
                                return _context27.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 14:
                            case "end":
                                return _context27.stop();
                        }
                    }
                }, _callee27, this);
            }));

            function _initialBlockDownload() {
                return _ref27.apply(this, arguments);
            }

            return _initialBlockDownload;
        }()
    }, {
        key: "verifyBlock",
        value: function () {
            var _ref29 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28(block, options) {
                var storageName, sr, result, verifyResult, redoLog, redoError, digestResult, nber, csr;
                return _regenerator2.default.wrap(function _callee28$(_context28) {
                    while (1) {
                        switch (_context28.prev = _context28.next) {
                            case 0:
                                this.m_logger.info("begin verify block number: " + block.number + " hash: " + block.hash + " ");
                                storageName = 'verify';

                                if (options.storageName) {
                                    storageName = options.storageName;
                                }
                                _context28.next = 5;
                                return this.m_storageManager.createStorage(storageName, block.header.preBlockHash);

                            case 5:
                                sr = _context28.sent;

                                if (!sr.err) {
                                    _context28.next = 9;
                                    break;
                                }

                                this.m_logger.warn("verify block failed for recover storage to previous block's failed for " + sr.err);
                                return _context28.abrupt("return", { err: sr.err });

                            case 9:
                                result = void 0;

                            case 10:
                                verifyResult = void 0;
                                // 通过redo log 来添加block的内容

                                if (!options.redoLog) {
                                    _context28.next = 32;
                                    break;
                                }

                                redoLog = options.redoLog;

                                this.m_logger.info("redo log, block[" + block.number + ", " + block.hash + "]");
                                // 把通过网络请求拿到的redoLog 先保存到本地
                                this.m_storageManager.writeRedoLog(block.hash, redoLog);
                                // 执行redolog
                                _context28.next = 17;
                                return redoLog.redoOnStorage(sr.storage);

                            case 17:
                                redoError = _context28.sent;

                                if (!redoError) {
                                    _context28.next = 22;
                                    break;
                                }

                                this.m_logger.info("redo error " + redoError);
                                result = { err: redoError };
                                return _context28.abrupt("break", 60);

                            case 22:
                                _context28.next = 24;
                                return sr.storage.messageDigest();

                            case 24:
                                digestResult = _context28.sent;

                                if (!digestResult.err) {
                                    _context28.next = 29;
                                    break;
                                }

                                this.m_logger.info("redo log get storage messageDigest error");
                                result = { err: digestResult.err };
                                return _context28.abrupt("break", 60);

                            case 29:
                                // 当前的storage hash和header上的storageHash 比较 
                                // 设置verify 结果, 后续流程需要使用 res.valid
                                verifyResult = { err: error_code_1.ErrorCode.RESULT_OK, valid: digestResult.value === block.header.storageHash };
                                _context28.next = 41;
                                break;

                            case 32:
                                _context28.next = 34;
                                return this.newBlockExecutor(block, sr.storage);

                            case 34:
                                nber = _context28.sent;

                                if (!nber.err) {
                                    _context28.next = 38;
                                    break;
                                }

                                result = { err: nber.err };
                                return _context28.abrupt("break", 60);

                            case 38:
                                _context28.next = 40;
                                return nber.executor.verify(this.logger);

                            case 40:
                                verifyResult = _context28.sent;

                            case 41:
                                if (!verifyResult.err) {
                                    _context28.next = 45;
                                    break;
                                }

                                result = { err: verifyResult.err };
                                _context28.next = 59;
                                break;

                            case 45:
                                if (!verifyResult.valid) {
                                    _context28.next = 57;
                                    break;
                                }

                                this.m_logger.info("block verified");

                                if (options.ignoreSnapshot) {
                                    _context28.next = 54;
                                    break;
                                }

                                _context28.next = 50;
                                return this.m_storageManager.createSnapshot(sr.storage, block.hash);

                            case 50:
                                csr = _context28.sent;

                                if (csr.err) {
                                    result = { err: csr.err };
                                } else {
                                    result = { err: error_code_1.ErrorCode.RESULT_OK, verified: true, storage: csr.snapshot };
                                }
                                _context28.next = 55;
                                break;

                            case 54:
                                result = { err: error_code_1.ErrorCode.RESULT_OK, verified: true };

                            case 55:
                                _context28.next = 59;
                                break;

                            case 57:
                                this.m_logger.info("block invalid");
                                result = { err: error_code_1.ErrorCode.RESULT_OK, verified: false };

                            case 59:
                                if (false) {
                                    _context28.next = 10;
                                    break;
                                }

                            case 60:
                                _context28.next = 62;
                                return sr.storage.remove();

                            case 62:
                                return _context28.abrupt("return", result);

                            case 63:
                            case "end":
                                return _context28.stop();
                        }
                    }
                }, _callee28, this);
            }));

            function verifyBlock(_x35, _x36) {
                return _ref29.apply(this, arguments);
            }

            return verifyBlock;
        }()
    }, {
        key: "addMinedBlock",
        value: function () {
            var _ref30 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29(block, storage) {
                var err;
                return _regenerator2.default.wrap(function _callee29$(_context29) {
                    while (1) {
                        switch (_context29.prev = _context29.next) {
                            case 0:
                                this.m_blockStorage.add(block);
                                this.m_logger.info("miner mined block number:" + block.number + " hash:" + block.hash);
                                assert(this.m_headerStorage);
                                _context29.next = 5;
                                return this.m_headerStorage.saveHeader(block.header);

                            case 5:
                                err = _context29.sent;

                                if (!err) {
                                    this._addPendingBlocks({ block: block, storage: storage });
                                }

                            case 7:
                            case "end":
                                return _context29.stop();
                        }
                    }
                }, _callee29, this);
            }));

            function addMinedBlock(_x37, _x38) {
                return _ref30.apply(this, arguments);
            }

            return addMinedBlock;
        }()
    }, {
        key: "onPreCreateGenesis",
        value: function () {
            var _ref31 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30(globalOptions, genesisOptions) {
                var err;
                return _regenerator2.default.wrap(function _callee30$(_context30) {
                    while (1) {
                        switch (_context30.prev = _context30.next) {
                            case 0:
                                _context30.next = 2;
                                return this.setGlobalOptions(globalOptions);

                            case 2:
                                err = _context30.sent;
                                return _context30.abrupt("return", err);

                            case 4:
                            case "end":
                                return _context30.stop();
                        }
                    }
                }, _callee30, this);
            }));

            function onPreCreateGenesis(_x39, _x40) {
                return _ref31.apply(this, arguments);
            }

            return onPreCreateGenesis;
        }()
        /**
         * virtual
         * @param block
         */

    }, {
        key: "onCreateGenesisBlock",
        value: function () {
            var _ref32 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee31(block, storage, genesisOptions) {
                var dbr, kvr, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _step8$value, key, value, _ref33, err;

                return _regenerator2.default.wrap(function _callee31$(_context31) {
                    while (1) {
                        switch (_context31.prev = _context31.next) {
                            case 0:
                                _context31.next = 2;
                                return storage.createDatabase(Chain.dbUser);

                            case 2:
                                dbr = _context31.sent;

                                if (!dbr.err) {
                                    _context31.next = 6;
                                    break;
                                }

                                this.m_logger.error("miner create genensis block failed for create user table to storage failed " + dbr.err);
                                return _context31.abrupt("return", dbr.err);

                            case 6:
                                _context31.next = 8;
                                return storage.createDatabase(Chain.dbSystem);

                            case 8:
                                dbr = _context31.sent;

                                if (!dbr.err) {
                                    _context31.next = 11;
                                    break;
                                }

                                return _context31.abrupt("return", dbr.err);

                            case 11:
                                _context31.next = 13;
                                return dbr.value.createKeyValue(Chain.kvNonce);

                            case 13:
                                kvr = _context31.sent;

                                if (!kvr.err) {
                                    _context31.next = 17;
                                    break;
                                }

                                this.m_logger.error("miner create genensis block failed for create nonce table to storage failed " + kvr.err);
                                return _context31.abrupt("return", kvr.err);

                            case 17:
                                _context31.next = 19;
                                return dbr.value.createKeyValue(Chain.kvConfig);

                            case 19:
                                kvr = _context31.sent;

                                if (!kvr.err) {
                                    _context31.next = 23;
                                    break;
                                }

                                this.m_logger.error("miner create genensis block failed for create config table to storage failed " + kvr.err);
                                return _context31.abrupt("return", kvr.err);

                            case 23:
                                _iteratorNormalCompletion8 = true;
                                _didIteratorError8 = false;
                                _iteratorError8 = undefined;
                                _context31.prev = 26;
                                _iterator8 = (0, _getIterator3.default)((0, _entries2.default)(this.globalOptions));

                            case 28:
                                if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                                    _context31.next = 44;
                                    break;
                                }

                                _step8$value = (0, _slicedToArray3.default)(_step8.value, 2), key = _step8$value[0], value = _step8$value[1];

                                if (util_1.isString(value) || util_1.isNumber(value) || util_1.isBoolean(value)) {
                                    _context31.next = 34;
                                    break;
                                }

                                assert(false, "invalid globalOptions " + key);
                                this.m_logger.error("miner create genensis block failed for write global config to storage failed for invalid globalOptions " + key);
                                return _context31.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_FORMAT);

                            case 34:
                                _context31.next = 36;
                                return kvr.kv.hset('global', key, value);

                            case 36:
                                _ref33 = _context31.sent;
                                err = _ref33.err;

                                if (!err) {
                                    _context31.next = 41;
                                    break;
                                }

                                this.m_logger.error("miner create genensis block failed for write global config to storage failed " + err);
                                return _context31.abrupt("return", err);

                            case 41:
                                _iteratorNormalCompletion8 = true;
                                _context31.next = 28;
                                break;

                            case 44:
                                _context31.next = 50;
                                break;

                            case 46:
                                _context31.prev = 46;
                                _context31.t0 = _context31["catch"](26);
                                _didIteratorError8 = true;
                                _iteratorError8 = _context31.t0;

                            case 50:
                                _context31.prev = 50;
                                _context31.prev = 51;

                                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                    _iterator8.return();
                                }

                            case 53:
                                _context31.prev = 53;

                                if (!_didIteratorError8) {
                                    _context31.next = 56;
                                    break;
                                }

                                throw _iteratorError8;

                            case 56:
                                return _context31.finish(53);

                            case 57:
                                return _context31.finish(50);

                            case 58:
                                return _context31.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 59:
                            case "end":
                                return _context31.stop();
                        }
                    }
                }, _callee31, this, [[26, 46, 50, 58], [51,, 53, 57]]);
            }));

            function onCreateGenesisBlock(_x41, _x42, _x43) {
                return _ref32.apply(this, arguments);
            }

            return onCreateGenesisBlock;
        }()
    }, {
        key: "onPostCreateGenesis",
        value: function () {
            var _ref34 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee32(genesis, storage) {
                var err;
                return _regenerator2.default.wrap(function _callee32$(_context32) {
                    while (1) {
                        switch (_context32.prev = _context32.next) {
                            case 0:
                                // assert(genesis.header.storageHash === (await storage.messageDigest()).value);
                                assert(genesis.number === 0);

                                if (!(genesis.number !== 0)) {
                                    _context32.next = 3;
                                    break;
                                }

                                return _context32.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_PARAM);

                            case 3:
                                assert(this.m_headerStorage && this.m_blockStorage);
                                this.m_blockStorage.add(genesis);
                                _context32.next = 7;
                                return this.m_headerStorage.createGenesis(genesis.header);

                            case 7:
                                err = _context32.sent;

                                if (!err) {
                                    _context32.next = 10;
                                    break;
                                }

                                return _context32.abrupt("return", err);

                            case 10:
                                _context32.next = 12;
                                return this._onVerifiedBlock(genesis);

                            case 12:
                                return _context32.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 13:
                            case "end":
                                return _context32.stop();
                        }
                    }
                }, _callee32, this);
            }));

            function onPostCreateGenesis(_x44, _x45) {
                return _ref34.apply(this, arguments);
            }

            return onPostCreateGenesis;
        }()
    }, {
        key: "view",
        value: function () {
            var _ref35 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee33(from, methodname, param) {
                var retInfo, storageView, hr, header, svr, nver, ret1;
                return _regenerator2.default.wrap(function _callee33$(_context33) {
                    while (1) {
                        switch (_context33.prev = _context33.next) {
                            case 0:
                                retInfo = { err: error_code_1.ErrorCode.RESULT_FAILED };
                                storageView = void 0;

                            case 2:
                                _context33.next = 4;
                                return this.getHeader(from);

                            case 4:
                                hr = _context33.sent;

                                if (!(hr.err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context33.next = 9;
                                    break;
                                }

                                this.m_logger.error("view " + methodname + " failed for load header " + from + " failed for " + hr.err);
                                retInfo = { err: hr.err };
                                return _context33.abrupt("break", 37);

                            case 9:
                                header = hr.header;
                                _context33.next = 12;
                                return this.m_storageManager.getSnapshotView(header.hash);

                            case 12:
                                svr = _context33.sent;

                                if (!(svr.err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context33.next = 17;
                                    break;
                                }

                                this.m_logger.error("view " + methodname + " failed for get snapshot " + header.hash + " failed for " + svr.err);
                                retInfo = { err: svr.err };
                                return _context33.abrupt("break", 37);

                            case 17:
                                storageView = svr.storage;
                                _context33.next = 20;
                                return this.newViewExecutor(header, storageView, methodname, param);

                            case 20:
                                nver = _context33.sent;

                                if (!nver.err) {
                                    _context33.next = 26;
                                    break;
                                }

                                this.m_logger.error("view " + methodname + " failed for create view executor failed for " + nver.err);
                                retInfo = { err: nver.err };
                                this.m_storageManager.releaseSnapshotView(header.hash);
                                return _context33.abrupt("break", 37);

                            case 26:
                                _context33.next = 28;
                                return nver.executor.execute();

                            case 28:
                                ret1 = _context33.sent;

                                this.m_storageManager.releaseSnapshotView(header.hash);

                                if (!(ret1.err === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context33.next = 33;
                                    break;
                                }

                                retInfo = { err: error_code_1.ErrorCode.RESULT_OK, value: ret1.value };
                                return _context33.abrupt("break", 37);

                            case 33:
                                this.m_logger.error("view " + methodname + " failed for create view executor failed for " + ret1.err);
                                retInfo = { err: ret1.err };
                                return _context33.abrupt("break", 37);

                            case 36:
                                if (false) {
                                    _context33.next = 2;
                                    break;
                                }

                            case 37:
                                return _context33.abrupt("return", retInfo);

                            case 38:
                            case "end":
                                return _context33.stop();
                        }
                    }
                }, _callee33, this);
            }));

            function view(_x46, _x47, _x48) {
                return _ref35.apply(this, arguments);
            }

            return view;
        }()
    }, {
        key: "getNonce",
        value: function () {
            var _ref36 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee34(s) {
                return _regenerator2.default.wrap(function _callee34$(_context34) {
                    while (1) {
                        switch (_context34.prev = _context34.next) {
                            case 0:
                                _context34.next = 2;
                                return this.m_pending.getStorageNonce(s);

                            case 2:
                                return _context34.abrupt("return", _context34.sent);

                            case 3:
                            case "end":
                                return _context34.stop();
                        }
                    }
                }, _callee34, this);
            }));

            function getNonce(_x49) {
                return _ref36.apply(this, arguments);
            }

            return getNonce;
        }()
    }, {
        key: "getTransactionReceipt",
        value: function () {
            var _ref37 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee35(s) {
                var ret, block, tx, receipt;
                return _regenerator2.default.wrap(function _callee35$(_context35) {
                    while (1) {
                        switch (_context35.prev = _context35.next) {
                            case 0:
                                _context35.next = 2;
                                return this.m_headerStorage.txView.get(s);

                            case 2:
                                ret = _context35.sent;

                                if (!(ret.err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context35.next = 6;
                                    break;
                                }

                                this.logger.error("get transaction receipt " + s + " failed for " + ret.err);
                                return _context35.abrupt("return", { err: ret.err });

                            case 6:
                                block = this.getBlock(ret.blockhash);

                                if (block) {
                                    _context35.next = 10;
                                    break;
                                }

                                this.logger.error("get transaction receipt failed for get block " + ret.blockhash + " failed");
                                return _context35.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 10:
                                tx = block.content.getTransaction(s);
                                receipt = block.content.getReceipt(s);

                                if (!(tx && receipt)) {
                                    _context35.next = 14;
                                    break;
                                }

                                return _context35.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, block: block.header, tx: tx, receipt: receipt });

                            case 14:
                                assert(false, "transaction " + s + " declared in " + ret.blockhash + " but not found in block");
                                return _context35.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 16:
                            case "end":
                                return _context35.stop();
                        }
                    }
                }, _callee35, this);
            }));

            function getTransactionReceipt(_x50) {
                return _ref37.apply(this, arguments);
            }

            return getTransactionReceipt;
        }()
    }, {
        key: "addTransaction",
        value: function addTransaction(tx) {
            return this._addTransaction(tx);
        }
    }, {
        key: "_getBlockHeaderType",
        value: function _getBlockHeaderType() {
            return block_1.BlockHeader;
        }
    }, {
        key: "_getTransactionType",
        value: function _getTransactionType() {
            return block_1.Transaction;
        }
    }, {
        key: "_broadcastDepth",
        get: function get() {
            return this.m_instanceOptions.confirmDepth;
        }
    }, {
        key: "_confirmDepth",
        get: function get() {
            return this.m_instanceOptions.confirmDepth;
        }
    }, {
        key: "_headerReqLimit",
        get: function get() {
            return this.m_instanceOptions.headerReqLimit;
        }
    }, {
        key: "_initializePeerCount",
        get: function get() {
            return this.m_instanceOptions.initializePeerCount;
        }
    }, {
        key: "_ignoreVerify",
        get: function get() {
            return this.m_instanceOptions.ignoreVerify;
        }
    }, {
        key: "globalOptions",
        get: function get() {
            var c = this.m_globalOptions;
            return c;
        }
    }, {
        key: "logger",
        get: function get() {
            return this.m_logger;
        }
    }, {
        key: "pending",
        get: function get() {
            return this.m_pending;
        }
    }, {
        key: "storageManager",
        get: function get() {
            return this.m_storageManager;
        }
    }, {
        key: "blockStorage",
        get: function get() {
            return this.m_blockStorage;
        }
    }, {
        key: "dataDir",
        get: function get() {
            return this.m_dataDir;
        }
    }, {
        key: "node",
        get: function get() {
            return this.m_node;
        }
    }, {
        key: "peerid",
        get: function get() {
            return this.m_node.base.peerid;
        }
    }, {
        key: "handler",
        get: function get() {
            return this.m_handler;
        }
    }, {
        key: "headerStorage",
        get: function get() {
            return this.m_headerStorage;
        }
    }, {
        key: "tipBlockHeader",
        get: function get() {
            return this.m_tip;
        }
    }], [{
        key: "dataDirValid",
        value: function dataDirValid(dataDir) {
            if (!fs.pathExistsSync(dataDir)) {
                return false;
            }
            if (!fs.pathExistsSync(path.join(dataDir, Chain.s_dbFile))) {
                return false;
            }
            return true;
        }
    }]);
    return Chain;
}(events_1.EventEmitter);
// 存储address入链的tx的最大nonce


Chain.dbSystem = '__system';
Chain.kvNonce = 'nonce'; // address<--->nonce
Chain.kvConfig = 'config';
Chain.dbUser = '__user';
Chain.s_dbFile = 'database';
exports.Chain = Chain;