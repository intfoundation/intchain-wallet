"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var createValueDebuger = function () {
    var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(chainCreator, dataDir) {
        var ccir, err;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _context13.next = 2;
                        return chainCreator.createChainInstance(dataDir, { readonly: true });

                    case 2:
                        ccir = _context13.sent;

                        if (!ccir.err) {
                            _context13.next = 6;
                            break;
                        }

                        chainCreator.logger.error("create chain instance from " + dataDir + " failed ", error_code_1.stringifyErrorCode(ccir.err));
                        return _context13.abrupt("return", { err: ccir.err });

                    case 6:
                        _context13.next = 8;
                        return ccir.chain.setGlobalOptions(ccir.globalOptions);

                    case 8:
                        err = _context13.sent;

                        if (!err) {
                            _context13.next = 12;
                            break;
                        }

                        chainCreator.logger.error("setGlobalOptions failed ", error_code_1.stringifyErrorCode(err));
                        return _context13.abrupt("return", { err: err });

                    case 12:
                        return _context13.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, debuger: new ValueMemoryDebuger(ccir.chain, chainCreator.logger) });

                    case 13:
                    case "end":
                        return _context13.stop();
                }
            }
        }, _callee13, this);
    }));

    return function createValueDebuger(_x23, _x24) {
        return _ref14.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("./error_code");
var bignumber_js_1 = require("bignumber.js");
var storage_1 = require("./storage_json/storage");
var value_chain_1 = require("./value_chain");
var address_1 = require("./address");
var storage_2 = require("./storage");
var util_1 = require("util");

var ValueChainDebugSession = function () {
    function ValueChainDebugSession(debuger) {
        (0, _classCallCheck3.default)(this, ValueChainDebugSession);

        this.debuger = debuger;
    }

    (0, _createClass3.default)(ValueChainDebugSession, [{
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(storageDir) {
                var chain, dumpSnapshotManager, snapshotManager, storageManager, err, ghr, genesisHash, gsr, gsvr, srcStorage, csr, dstStorage, tjsr;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                chain = this.debuger.chain;
                                dumpSnapshotManager = new storage_2.StorageDumpSnapshotManager({
                                    logger: chain.logger,
                                    path: storageDir
                                });

                                this.m_dumpSnapshotManager = dumpSnapshotManager;
                                snapshotManager = new storage_2.StorageLogSnapshotManager({
                                    path: chain.storageManager.path,
                                    headerStorage: chain.headerStorage,
                                    storageType: storage_1.JsonStorage,
                                    logger: chain.logger,
                                    dumpSnapshotManager: dumpSnapshotManager
                                });
                                storageManager = new storage_2.StorageManager({
                                    path: storageDir,
                                    storageType: storage_1.JsonStorage,
                                    logger: chain.logger,
                                    snapshotManager: snapshotManager
                                });

                                this.m_storageManager = storageManager;
                                _context.next = 8;
                                return this.m_storageManager.init();

                            case 8:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 12;
                                    break;
                                }

                                chain.logger.error("ValueChainDebugSession init storageManager init failed ", error_code_1.stringifyErrorCode(err));
                                return _context.abrupt("return", err);

                            case 12:
                                _context.next = 14;
                                return chain.headerStorage.getHeader(0);

                            case 14:
                                ghr = _context.sent;

                                if (!ghr.err) {
                                    _context.next = 18;
                                    break;
                                }

                                chain.logger.error("ValueChainDebugSession init get genesis header failed ", error_code_1.stringifyErrorCode(ghr.err));
                                return _context.abrupt("return", ghr.err);

                            case 18:
                                genesisHash = ghr.header.hash;
                                _context.next = 21;
                                return this.m_dumpSnapshotManager.getSnapshot(genesisHash);

                            case 21:
                                gsr = _context.sent;

                                if (gsr.err) {
                                    _context.next = 26;
                                    break;
                                }

                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 26:
                                if (!(gsr.err !== error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context.next = 29;
                                    break;
                                }

                                chain.logger.error("ValueChainDebugSession init get gensis dump snapshot err ", error_code_1.stringifyErrorCode(gsr.err));
                                return _context.abrupt("return", gsr.err);

                            case 29:
                                _context.next = 31;
                                return chain.storageManager.getSnapshotView(genesisHash);

                            case 31:
                                gsvr = _context.sent;

                                if (!gsvr.err) {
                                    _context.next = 35;
                                    break;
                                }

                                chain.logger.error("ValueChainDebugSession init get gensis dump snapshot err ", error_code_1.stringifyErrorCode(gsvr.err));
                                return _context.abrupt("return", gsvr.err);

                            case 35:
                                srcStorage = gsvr.storage;
                                _context.next = 38;
                                return storageManager.createStorage('genesis');

                            case 38:
                                csr = _context.sent;

                                if (!csr.err) {
                                    _context.next = 42;
                                    break;
                                }

                                chain.logger.error("ValueChainDebugSession init create genesis memory storage failed ", error_code_1.stringifyErrorCode(csr.err));
                                return _context.abrupt("return", csr.err);

                            case 42:
                                dstStorage = csr.storage;
                                _context.next = 45;
                                return srcStorage.toJsonStorage(dstStorage);

                            case 45:
                                tjsr = _context.sent;

                                if (!tjsr.err) {
                                    _context.next = 49;
                                    break;
                                }

                                chain.logger.error("ValueChainDebugSession init transfer genesis memory storage failed ", error_code_1.stringifyErrorCode(tjsr.err));
                                return _context.abrupt("return", tjsr.err);

                            case 49:
                                _context.next = 51;
                                return this.m_storageManager.createSnapshot(dstStorage, genesisHash, true);

                            case 51:
                                csr = _context.sent;

                                if (!csr.err) {
                                    _context.next = 55;
                                    break;
                                }

                                chain.logger.error("ValueChainDebugSession init create genesis memory dump failed ", error_code_1.stringifyErrorCode(csr.err));
                                return _context.abrupt("return", csr.err);

                            case 55:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 56:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function init(_x) {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "block",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(hash) {
                var chain, block, csr, _ref3, err;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                chain = this.debuger.chain;
                                block = chain.blockStorage.get(hash);

                                if (block) {
                                    _context2.next = 5;
                                    break;
                                }

                                chain.logger.error("block " + hash + " not found");
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 5:
                                _context2.next = 7;
                                return this.m_storageManager.createStorage(hash, block.header.preBlockHash);

                            case 7:
                                csr = _context2.sent;

                                if (csr.err) {
                                    chain.logger.error("block " + hash + " create pre block storage failed ", error_code_1.stringifyErrorCode(csr.err));
                                }
                                _context2.next = 11;
                                return this.debuger.debugBlock(csr.storage, block);

                            case 11:
                                _ref3 = _context2.sent;
                                err = _ref3.err;

                                csr.storage.remove();
                                return _context2.abrupt("return", { err: err });

                            case 15:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function block(_x2) {
                return _ref2.apply(this, arguments);
            }

            return block;
        }()
    }, {
        key: "transaction",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(hash) {
                var chain, gtrr;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                chain = this.debuger.chain;
                                _context3.next = 3;
                                return chain.getTransactionReceipt(hash);

                            case 3:
                                gtrr = _context3.sent;

                                if (!gtrr.err) {
                                    _context3.next = 7;
                                    break;
                                }

                                chain.logger.error("transaction " + hash + " get receipt failed ", error_code_1.stringifyErrorCode(gtrr.err));
                                return _context3.abrupt("return", { err: gtrr.err });

                            case 7:
                                return _context3.abrupt("return", this.block(gtrr.block.hash));

                            case 8:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function transaction(_x3) {
                return _ref4.apply(this, arguments);
            }

            return transaction;
        }()
    }, {
        key: "view",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(from, method, params) {
                var chain, hr, header, svr, ret;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                chain = this.debuger.chain;
                                _context4.next = 3;
                                return chain.headerStorage.getHeader(from);

                            case 3:
                                hr = _context4.sent;

                                if (!(hr.err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context4.next = 7;
                                    break;
                                }

                                chain.logger.error("view " + method + " failed for load header " + from + " failed for " + hr.err);
                                return _context4.abrupt("return", { err: hr.err });

                            case 7:
                                header = hr.header;
                                _context4.next = 10;
                                return this.m_storageManager.getSnapshotView(header.hash);

                            case 10:
                                svr = _context4.sent;

                                if (!(svr.err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context4.next = 14;
                                    break;
                                }

                                chain.logger.error("view " + method + " failed for get snapshot " + header.hash + " failed for " + svr.err);
                                return _context4.abrupt("return", { err: svr.err });

                            case 14:
                                _context4.next = 16;
                                return this.debuger.debugView(svr.storage, header, method, params);

                            case 16:
                                ret = _context4.sent;

                                this.m_storageManager.releaseSnapshotView(header.hash);
                                return _context4.abrupt("return", ret);

                            case 19:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function view(_x4, _x5, _x6) {
                return _ref5.apply(this, arguments);
            }

            return view;
        }()
    }]);
    return ValueChainDebugSession;
}();

exports.ValueChainDebugSession = ValueChainDebugSession;

var ValueIndependentDebugSession = function () {
    function ValueIndependentDebugSession(debuger) {
        (0, _classCallCheck3.default)(this, ValueIndependentDebugSession);

        this.debuger = debuger;
    }

    (0, _createClass3.default)(ValueIndependentDebugSession, [{
        key: "init",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(options) {
                var csr, i, chain, gh, block, genesissOptions, err, _err;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.debuger.createStorage();

                            case 2:
                                csr = _context5.sent;

                                if (!csr.err) {
                                    _context5.next = 5;
                                    break;
                                }

                                return _context5.abrupt("return", csr.err);

                            case 5:
                                this.m_storage = csr.storage;
                                if (util_1.isArray(options.accounts)) {
                                    this.m_accounts = options.accounts.map(function (x) {
                                        return Buffer.from(x);
                                    });
                                } else {
                                    this.m_accounts = [];
                                    for (i = 0; i < options.accounts; ++i) {
                                        this.m_accounts.push(address_1.createKeyPair()[1]);
                                    }
                                }
                                this.m_interval = options.interval;
                                chain = this.debuger.chain;
                                gh = chain.newBlockHeader();

                                gh.timestamp = Date.now() / 1000;
                                block = chain.newBlock(gh);
                                genesissOptions = {};

                                genesissOptions.candidates = [];
                                genesissOptions.miners = [];
                                genesissOptions.coinbase = address_1.addressFromSecretKey(this.m_accounts[options.coinbase]);
                                if (options.preBalance) {
                                    genesissOptions.preBalances = [];
                                    this.m_accounts.forEach(function (value) {
                                        genesissOptions.preBalances.push({ address: address_1.addressFromSecretKey(value), amount: options.preBalance });
                                    });
                                }
                                _context5.next = 19;
                                return chain.onCreateGenesisBlock(block, csr.storage, genesissOptions);

                            case 19:
                                err = _context5.sent;

                                if (!err) {
                                    _context5.next = 23;
                                    break;
                                }

                                chain.logger.error("onCreateGenesisBlock failed for ", error_code_1.stringifyErrorCode(err));
                                return _context5.abrupt("return", err);

                            case 23:
                                gh.updateHash();

                                if (!(options.height > 0)) {
                                    _context5.next = 30;
                                    break;
                                }

                                _err = this.updateHeightTo(options.height, options.coinbase);

                                if (!_err) {
                                    _context5.next = 28;
                                    break;
                                }

                                return _context5.abrupt("return", _err);

                            case 28:
                                _context5.next = 31;
                                break;

                            case 30:
                                this.m_curHeader = block.header;

                            case 31:
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 32:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function init(_x7) {
                return _ref6.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "updateHeightTo",
        value: function updateHeightTo(height, coinbase) {
            if (height <= this.m_curHeader.number) {
                this.debuger.chain.logger.error("updateHeightTo " + height + " failed for current height " + this.m_curHeader.number + " is larger");
                return error_code_1.ErrorCode.RESULT_INVALID_PARAM;
            }
            var curHeader = this.m_curHeader;
            var offset = height - curHeader.number;
            for (var i = 0; i <= offset; ++i) {
                var header = this.debuger.chain.newBlockHeader();
                header.timestamp = curHeader.timestamp + this.m_interval;
                header.coinbase = address_1.addressFromSecretKey(this.m_accounts[coinbase]);
                header.setPreBlock(curHeader);
                curHeader = header;
            }
            this.m_curHeader = curHeader;
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "transaction",
        value: function transaction(options) {
            var tx = new value_chain_1.ValueTransaction();
            tx.fee = new bignumber_js_1.BigNumber(0);
            tx.value = new bignumber_js_1.BigNumber(options.value);
            tx.method = options.method;
            tx.input = options.input;
            tx.sign(this.m_accounts[options.caller]);
            return this.debuger.debugTransaction(this.m_storage, this.m_curHeader, tx);
        }
    }, {
        key: "wage",
        value: function wage() {
            return this.debuger.debugMinerWageEvent(this.m_storage, this.m_curHeader);
        }
    }, {
        key: "view",
        value: function view(options) {
            return this.debuger.debugView(this.m_storage, this.m_curHeader, options.method, options.params);
        }
    }, {
        key: "getAccount",
        value: function getAccount(index) {
            return address_1.addressFromSecretKey(this.m_accounts[index]);
        }
    }]);
    return ValueIndependentDebugSession;
}();

exports.ValueIndependentDebugSession = ValueIndependentDebugSession;

var MemoryDebuger = function () {
    function MemoryDebuger(chain, logger) {
        (0, _classCallCheck3.default)(this, MemoryDebuger);

        this.chain = chain;
        this.logger = logger;
    }

    (0, _createClass3.default)(MemoryDebuger, [{
        key: "createStorage",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var storage, err;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                storage = new storage_1.JsonStorage({
                                    filePath: '',
                                    logger: this.logger
                                });
                                _context6.next = 3;
                                return storage.init();

                            case 3:
                                err = _context6.sent;

                                if (!err) {
                                    _context6.next = 7;
                                    break;
                                }

                                this.chain.logger.error("init storage failed ", error_code_1.stringifyErrorCode(err));
                                return _context6.abrupt("return", { err: err });

                            case 7:
                                storage.createLogger();
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, storage: storage });

                            case 9:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createStorage() {
                return _ref7.apply(this, arguments);
            }

            return createStorage;
        }()
    }, {
        key: "debugTransaction",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(storage, header, tx) {
                var block, nber, etr;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                block = this.chain.newBlock(header);
                                _context7.next = 3;
                                return this.chain.newBlockExecutor(block, storage);

                            case 3:
                                nber = _context7.sent;

                                if (!nber.err) {
                                    _context7.next = 6;
                                    break;
                                }

                                return _context7.abrupt("return", { err: nber.err });

                            case 6:
                                _context7.next = 8;
                                return nber.executor.executeTransaction(tx, { ignoreNoce: true });

                            case 8:
                                etr = _context7.sent;

                                if (!etr.err) {
                                    _context7.next = 11;
                                    break;
                                }

                                return _context7.abrupt("return", { err: etr.err });

                            case 11:
                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, receipt: etr.receipt });

                            case 12:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function debugTransaction(_x8, _x9, _x10) {
                return _ref8.apply(this, arguments);
            }

            return debugTransaction;
        }()
    }, {
        key: "debugBlockEvent",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(storage, header, listener) {
                var block, nber, err;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                block = this.chain.newBlock(header);
                                _context8.next = 3;
                                return this.chain.newBlockExecutor(block, storage);

                            case 3:
                                nber = _context8.sent;

                                if (!nber.err) {
                                    _context8.next = 6;
                                    break;
                                }

                                return _context8.abrupt("return", { err: nber.err });

                            case 6:
                                _context8.next = 8;
                                return nber.executor.executeBlockEvent(listener);

                            case 8:
                                err = _context8.sent;
                                return _context8.abrupt("return", { err: err });

                            case 10:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function debugBlockEvent(_x11, _x12, _x13) {
                return _ref9.apply(this, arguments);
            }

            return debugBlockEvent;
        }()
    }, {
        key: "debugView",
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(storage, header, method, params) {
                var nver;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.chain.newViewExecutor(header, storage, method, params);

                            case 2:
                                nver = _context9.sent;

                                if (!nver.err) {
                                    _context9.next = 5;
                                    break;
                                }

                                return _context9.abrupt("return", { err: nver.err });

                            case 5:
                                return _context9.abrupt("return", nver.executor.execute());

                            case 6:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function debugView(_x14, _x15, _x16, _x17) {
                return _ref10.apply(this, arguments);
            }

            return debugView;
        }()
    }, {
        key: "debugBlock",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(storage, block) {
                var nber, err;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.chain.newBlockExecutor(block, storage);

                            case 2:
                                nber = _context10.sent;

                                if (!nber.err) {
                                    _context10.next = 5;
                                    break;
                                }

                                return _context10.abrupt("return", { err: nber.err });

                            case 5:
                                _context10.next = 7;
                                return nber.executor.execute();

                            case 7:
                                err = _context10.sent;
                                return _context10.abrupt("return", { err: err });

                            case 9:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function debugBlock(_x18, _x19) {
                return _ref11.apply(this, arguments);
            }

            return debugBlock;
        }()
    }]);
    return MemoryDebuger;
}();

var ValueMemoryDebuger = function (_MemoryDebuger) {
    (0, _inherits3.default)(ValueMemoryDebuger, _MemoryDebuger);

    function ValueMemoryDebuger() {
        (0, _classCallCheck3.default)(this, ValueMemoryDebuger);
        return (0, _possibleConstructorReturn3.default)(this, (ValueMemoryDebuger.__proto__ || (0, _getPrototypeOf2.default)(ValueMemoryDebuger)).apply(this, arguments));
    }

    (0, _createClass3.default)(ValueMemoryDebuger, [{
        key: "debugMinerWageEvent",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(storage, header) {
                var block, nber, err;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                block = this.chain.newBlock(header);
                                _context11.next = 3;
                                return this.chain.newBlockExecutor(block, storage);

                            case 3:
                                nber = _context11.sent;

                                if (!nber.err) {
                                    _context11.next = 6;
                                    break;
                                }

                                return _context11.abrupt("return", { err: nber.err });

                            case 6:
                                _context11.next = 8;
                                return nber.executor.executeMinerWageEvent();

                            case 8:
                                err = _context11.sent;
                                return _context11.abrupt("return", { err: err });

                            case 10:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function debugMinerWageEvent(_x20, _x21) {
                return _ref12.apply(this, arguments);
            }

            return debugMinerWageEvent;
        }()
    }, {
        key: "createIndependentSession",
        value: function createIndependentSession() {
            return new ValueIndependentDebugSession(this);
        }
    }, {
        key: "createChainSession",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(storageDir) {
                var session, err;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                session = new ValueChainDebugSession(this);
                                _context12.next = 3;
                                return session.init(storageDir);

                            case 3:
                                err = _context12.sent;

                                if (!err) {
                                    _context12.next = 6;
                                    break;
                                }

                                return _context12.abrupt("return", { err: err });

                            case 6:
                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, session: session });

                            case 7:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function createChainSession(_x22) {
                return _ref13.apply(this, arguments);
            }

            return createChainSession;
        }()
    }]);
    return ValueMemoryDebuger;
}(MemoryDebuger);

exports.createValueDebuger = createValueDebuger;