"use strict";

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var chain_1 = require("./chain");
var error_code_1 = require("../error_code");
var assert = require("assert");
var events_1 = require("events");
var MinerState;
(function (MinerState) {
    MinerState[MinerState["none"] = 0] = "none";
    MinerState[MinerState["init"] = 1] = "init";
    MinerState[MinerState["syncing"] = 2] = "syncing";
    MinerState[MinerState["idle"] = 3] = "idle";
    MinerState[MinerState["executing"] = 4] = "executing";
    MinerState[MinerState["mining"] = 5] = "mining";
})(MinerState = exports.MinerState || (exports.MinerState = {}));

var Miner = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(Miner, _events_1$EventEmitte);

    function Miner(options) {
        (0, _classCallCheck3.default)(this, Miner);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Miner.__proto__ || (0, _getPrototypeOf2.default)(Miner)).call(this));

        _this.m_logger = options.logger;
        _this.m_state = MinerState.none;
        return _this;
    }

    (0, _createClass3.default)(Miner, [{
        key: "initComponents",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dataDir, handler) {
                var err;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(this.m_state > MinerState.none)) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                                this.m_chain = this._chainInstance();
                                _context.next = 5;
                                return this.m_chain.initComponents(dataDir, handler);

                            case 5:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 9;
                                    break;
                                }

                                this.m_logger.error("miner initComponent failed for chain initComponent failed", err);
                                return _context.abrupt("return", err);

                            case 9:
                                this.m_state = MinerState.init;
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 11:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function initComponents(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return initComponents;
        }()
    }, {
        key: "uninitComponents",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.m_state !== MinerState.init)) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt("return");

                            case 2:
                                _context2.next = 4;
                                return this.m_chain.uninitComponents();

                            case 4:
                                delete this.m_chain;
                                this.m_state = MinerState.none;

                            case 6:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function uninitComponents() {
                return _ref2.apply(this, arguments);
            }

            return uninitComponents;
        }()
    }, {
        key: "_chainInstance",
        value: function _chainInstance() {
            return new chain_1.Chain({ logger: this.m_logger });
        }
    }, {
        key: "parseInstanceOptions",
        value: function parseInstanceOptions(node, instanceOptions) {
            var value = (0, _create2.default)(null);
            value.node = node;
            if (instanceOptions.has('genesisMiner')) {
                value.minOutbound = 0;
            }
            return { err: error_code_1.ErrorCode.RESULT_OK, value: value };
        }
    }, {
        key: "initialize",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(options) {
                var err;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!(this.m_state !== MinerState.init)) {
                                    _context3.next = 3;
                                    break;
                                }

                                this.m_logger.error("miner initialize failed hasn't initComponent");
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_STATE);

                            case 3:
                                this.m_state = MinerState.syncing;
                                _context3.next = 6;
                                return this.m_chain.initialize(options);

                            case 6:
                                err = _context3.sent;

                                if (!err) {
                                    _context3.next = 10;
                                    break;
                                }

                                this.m_logger.error("miner initialize failed for chain initialize failed " + err);
                                return _context3.abrupt("return", err);

                            case 10:
                                this.m_onTipBlockListener = this._onTipBlock.bind(this);
                                this.m_chain.on('tipBlock', this.m_onTipBlockListener);
                                this.m_state = MinerState.idle;
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 14:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function initialize(_x3) {
                return _ref3.apply(this, arguments);
            }

            return initialize;
        }()
    }, {
        key: "uninitialize",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!(this.m_state <= MinerState.init)) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt("return");

                            case 2:
                                this.m_chain.removeListener('tipBlock', this.m_onTipBlockListener);
                                delete this.m_onTipBlockListener;
                                _context4.next = 6;
                                return this.m_chain.uninitialize();

                            case 6:
                                this.m_state = MinerState.init;

                            case 7:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function uninitialize() {
                return _ref4.apply(this, arguments);
            }

            return uninitialize;
        }()
    }, {
        key: "create",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(globalOptions, genesisOptions) {
                var err, genesis, sr, nber, ssr;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(this.m_state !== MinerState.init)) {
                                    _context5.next = 3;
                                    break;
                                }

                                this.m_logger.error("miner create failed hasn't initComponent");
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_STATE);

                            case 3:
                                _context5.next = 5;
                                return this.chain.onPreCreateGenesis(globalOptions, genesisOptions);

                            case 5:
                                err = _context5.sent;

                                if (!err) {
                                    _context5.next = 8;
                                    break;
                                }

                                return _context5.abrupt("return", err);

                            case 8:
                                genesis = this.m_chain.newBlock();

                                genesis.header.timestamp = Date.now() / 1000;
                                _context5.next = 12;
                                return this.chain.storageManager.createStorage('genesis');

                            case 12:
                                sr = _context5.sent;

                                if (!sr.err) {
                                    _context5.next = 15;
                                    break;
                                }

                                return _context5.abrupt("return", sr.err);

                            case 15:
                                _context5.next = 17;
                                return this._decorateBlock(genesis);

                            case 17:
                                err = _context5.sent;

                                if (!err) {
                                    _context5.next = 20;
                                    break;
                                }

                                return _context5.abrupt("break", 47);

                            case 20:
                                _context5.next = 22;
                                return this.chain.onCreateGenesisBlock(genesis, sr.storage, genesisOptions);

                            case 22:
                                err = _context5.sent;

                                if (!err) {
                                    _context5.next = 25;
                                    break;
                                }

                                return _context5.abrupt("break", 47);

                            case 25:
                                _context5.next = 27;
                                return this.chain.newBlockExecutor(genesis, sr.storage);

                            case 27:
                                nber = _context5.sent;

                                if (!nber.err) {
                                    _context5.next = 31;
                                    break;
                                }

                                err = nber.err;
                                return _context5.abrupt("break", 47);

                            case 31:
                                _context5.next = 33;
                                return nber.executor.execute();

                            case 33:
                                err = _context5.sent;

                                if (!err) {
                                    _context5.next = 36;
                                    break;
                                }

                                return _context5.abrupt("break", 47);

                            case 36:
                                _context5.next = 38;
                                return this.chain.storageManager.createSnapshot(sr.storage, genesis.header.hash);

                            case 38:
                                ssr = _context5.sent;

                                if (!ssr.err) {
                                    _context5.next = 42;
                                    break;
                                }

                                err = ssr.err;
                                return _context5.abrupt("break", 47);

                            case 42:
                                assert(ssr.snapshot);
                                _context5.next = 45;
                                return this.chain.onPostCreateGenesis(genesis, ssr.snapshot);

                            case 45:
                                err = _context5.sent;

                            case 46:
                                if (false) {
                                    _context5.next = 15;
                                    break;
                                }

                            case 47:
                                _context5.next = 49;
                                return sr.storage.remove();

                            case 49:
                                return _context5.abrupt("return", err);

                            case 50:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function create(_x4, _x5) {
                return _ref5.apply(this, arguments);
            }

            return create;
        }()
    }, {
        key: "_createBlock",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(header) {
                var block, tx, sr, err, nber, ssr;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                block = this.chain.newBlock(header);

                                this.m_state = MinerState.executing;
                                tx = this.chain.pending.popTransaction();

                                while (tx) {
                                    block.content.addTransaction(tx);
                                    tx = this.chain.pending.popTransaction();
                                }
                                _context6.next = 6;
                                return this._decorateBlock(block);

                            case 6:
                                _context6.next = 8;
                                return this.chain.storageManager.createStorage(header.preBlockHash, block.header.preBlockHash);

                            case 8:
                                sr = _context6.sent;

                                if (!sr.err) {
                                    _context6.next = 11;
                                    break;
                                }

                                return _context6.abrupt("return", { err: sr.err });

                            case 11:
                                err = void 0;

                            case 12:
                                _context6.next = 14;
                                return this.chain.newBlockExecutor(block, sr.storage);

                            case 14:
                                nber = _context6.sent;

                                if (!nber.err) {
                                    _context6.next = 18;
                                    break;
                                }

                                err = nber.err;
                                return _context6.abrupt("break", 32);

                            case 18:
                                _context6.next = 20;
                                return nber.executor.execute();

                            case 20:
                                err = _context6.sent;

                                if (!err) {
                                    _context6.next = 24;
                                    break;
                                }

                                this.m_logger.error(this.chain.peerid + " execute failed! ret " + err);
                                return _context6.abrupt("break", 32);

                            case 24:
                                this.m_state = MinerState.mining;
                                _context6.next = 27;
                                return this._mineBlock(block);

                            case 27:
                                err = _context6.sent;

                                if (!err) {
                                    _context6.next = 31;
                                    break;
                                }

                                this.m_logger.error(this.chain.peerid + " mine block failed! ret " + err);
                                return _context6.abrupt("break", 32);

                            case 31:
                                if (false) {
                                    _context6.next = 12;
                                    break;
                                }

                            case 32:
                                if (!err) {
                                    _context6.next = 36;
                                    break;
                                }

                                _context6.next = 35;
                                return sr.storage.remove();

                            case 35:
                                return _context6.abrupt("return", { err: err });

                            case 36:
                                _context6.next = 38;
                                return this.chain.storageManager.createSnapshot(sr.storage, block.hash, true);

                            case 38:
                                ssr = _context6.sent;

                                if (!ssr.err) {
                                    _context6.next = 41;
                                    break;
                                }

                                return _context6.abrupt("return", { err: ssr.err });

                            case 41:
                                _context6.next = 43;
                                return this.chain.addMinedBlock(block, ssr.snapshot);

                            case 43:
                                this.m_state = MinerState.idle;
                                this.m_logger.info("finish mine a block on block hash: " + this.chain.tipBlockHeader.hash + " number: " + this.chain.tipBlockHeader.number);
                                return _context6.abrupt("return", { err: err, block: block });

                            case 46:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function _createBlock(_x6) {
                return _ref6.apply(this, arguments);
            }

            return _createBlock;
        }()
        /**
         * virtual
         * @param chain
         * @param tipBlock
         */

    }, {
        key: "_onTipBlock",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(chain, tipBlock) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function _onTipBlock(_x7, _x8) {
                return _ref7.apply(this, arguments);
            }

            return _onTipBlock;
        }()
        /**
         * virtual
         * @param block
         */

    }, {
        key: "_mineBlock",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(block) {
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                return _context8.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 1:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function _mineBlock(_x9) {
                return _ref8.apply(this, arguments);
            }

            return _mineBlock;
        }()
    }, {
        key: "_decorateBlock",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(block) {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                return _context9.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 1:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function _decorateBlock(_x10) {
                return _ref9.apply(this, arguments);
            }

            return _decorateBlock;
        }()
    }, {
        key: "chain",
        get: function get() {
            return this.m_chain;
        }
    }, {
        key: "peerid",
        get: function get() {
            return this.m_chain.peerid;
        }
    }]);
    return Miner;
}(events_1.EventEmitter);

exports.Miner = Miner;