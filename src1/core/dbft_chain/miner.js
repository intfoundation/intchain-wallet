"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

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
var assert = require('assert');
var error_code_1 = require("../error_code");
var Lock_1 = require("../lib/Lock");
var address_1 = require("../address");
var value_chain_1 = require("../value_chain");
var chain_1 = require("./chain");
var validators_node_1 = require("./validators_node");
var consensus_node_1 = require("./consensus_node");

var DbftMinerChain = function (_chain_1$DbftChain) {
    (0, _inherits3.default)(DbftMinerChain, _chain_1$DbftChain);

    function DbftMinerChain() {
        (0, _classCallCheck3.default)(this, DbftMinerChain);
        return (0, _possibleConstructorReturn3.default)(this, (DbftMinerChain.__proto__ || (0, _getPrototypeOf2.default)(DbftMinerChain)).apply(this, arguments));
    }

    (0, _createClass3.default)(DbftMinerChain, [{
        key: "_createChainNode",
        value: function _createChainNode() {
            var node = new validators_node_1.ValidatorsNode({
                node: this.m_instanceOptions.node,
                minConnectionRate: this.globalOptions.agreeRate,
                dataDir: this.m_dataDir,
                logger: this.m_logger,
                headerStorage: this.m_headerStorage,
                blockHeaderType: this._getBlockHeaderType(),
                transactionType: this._getTransactionType()
            });
            // 这里用sa的adderss初始化吧， sa部署的时候过略非miner地址的连接；
            //      因为没有同步之前无法知道当前的validators是哪些
            node.setValidators([this.globalOptions.superAdmin]);
            return node;
        }
    }, {
        key: "headerStorage",
        get: function get() {
            return this.m_headerStorage;
        }
    }]);
    return DbftMinerChain;
}(chain_1.DbftChain);

var DbftMiner = function (_value_chain_1$ValueM) {
    (0, _inherits3.default)(DbftMiner, _value_chain_1$ValueM);

    function DbftMiner(options) {
        (0, _classCallCheck3.default)(this, DbftMiner);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (DbftMiner.__proto__ || (0, _getPrototypeOf2.default)(DbftMiner)).call(this, options));

        _this2.m_mineLock = new Lock_1.Lock();
        _this2.m_verifyLock = new Lock_1.Lock();
        _this2.m_miningBlocks = new _map2.default();
        return _this2;
    }

    (0, _createClass3.default)(DbftMiner, [{
        key: "_chainInstance",
        value: function _chainInstance() {
            return new chain_1.DbftChain({ logger: this.m_logger });
        }
    }, {
        key: "parseInstanceOptions",
        value: function parseInstanceOptions(node, instanceOptions) {
            var _get$call = (0, _get3.default)(DbftMiner.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftMiner.prototype), "parseInstanceOptions", this).call(this, node, instanceOptions),
                err = _get$call.err,
                value = _get$call.value;

            if (err) {
                return { err: err };
            }
            if (!instanceOptions.get('minerSecret')) {
                this.m_logger.error("invalid instance options not minerSecret");
                return { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM };
            }
            value.minerSecret = Buffer.from(instanceOptions.get('minerSecret'), 'hex');
            return { err: error_code_1.ErrorCode.RESULT_OK, value: value };
        }
    }, {
        key: "initialize",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(options) {
                var _this3 = this;

                var err, tip;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                this.m_secret = options.minerSecret;
                                this.m_address = address_1.addressFromSecretKey(this.m_secret);
                                if (!options.coinbase) {
                                    this.coinbase = this.m_address;
                                }
                                _context4.next = 5;
                                return (0, _get3.default)(DbftMiner.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftMiner.prototype), "initialize", this).call(this, options);

                            case 5:
                                err = _context4.sent;

                                if (!err) {
                                    _context4.next = 9;
                                    break;
                                }

                                this.m_logger.error("dbft miner super initialize failed, errcode " + err);
                                return _context4.abrupt("return", err);

                            case 9:
                                this.m_consensusNode = new consensus_node_1.DbftConsensusNode({
                                    node: this.m_chain.node.base,
                                    globalOptions: this.m_chain.globalOptions,
                                    secret: this.m_secret
                                });
                                tip = this.chain.tipBlockHeader;
                                _context4.next = 13;
                                return this._updateTip(tip);

                            case 13:
                                err = _context4.sent;

                                if (!err) {
                                    _context4.next = 17;
                                    break;
                                }

                                this.m_logger.error("dbft miner initialize failed, errcode " + err);
                                return _context4.abrupt("return", err);

                            case 17:
                                this.m_consensusNode.on('createBlock', function () {
                                    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(header) {
                                        var cbr;
                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        if (!(header.preBlockHash !== _this3.chain.tipBlockHeader.hash)) {
                                                            _context.next = 3;
                                                            break;
                                                        }

                                                        _this3.m_logger.warn("mine block skipped");
                                                        return _context.abrupt("return");

                                                    case 3:
                                                        _this3.m_mineLock.enter();
                                                        _this3.m_logger.info("begin create block " + header.hash + " " + header.number + " " + header.view);
                                                        _context.next = 7;
                                                        return _this3._createBlock(header);

                                                    case 7:
                                                        cbr = _context.sent;

                                                        if (cbr.err) {
                                                            _this3.m_logger.error("create block failed ", cbr.err);
                                                        } else {
                                                            _this3.m_logger.info("create block finsihed ");
                                                        }
                                                        _this3.m_mineLock.leave();

                                                    case 10:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this3);
                                    }));

                                    return function (_x2) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }());
                                this.m_consensusNode.on('verifyBlock', function () {
                                    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(block) {
                                        var hr, vr;
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return _this3.chain.headerStorage.getHeader(block.header.hash);

                                                    case 2:
                                                        hr = _context2.sent;

                                                        if (hr.err) {
                                                            _context2.next = 8;
                                                            break;
                                                        }

                                                        _this3.m_logger.error("verify block already added to chain " + block.header.hash + " " + block.header.number);
                                                        return _context2.abrupt("return");

                                                    case 8:
                                                        if (!(hr.err !== error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                                            _context2.next = 11;
                                                            break;
                                                        }

                                                        _this3.m_logger.error("get header failed for ", hr.err);
                                                        return _context2.abrupt("return");

                                                    case 11:
                                                        _this3.m_logger.info("begin verify block " + block.hash + " " + block.number);
                                                        _this3.m_verifyLock.enter();
                                                        _context2.next = 15;
                                                        return _this3.chain.verifyBlock(block, { storageName: 'consensVerify', ignoreSnapshot: true });

                                                    case 15:
                                                        vr = _context2.sent;

                                                        _this3.m_verifyLock.leave();

                                                        if (!vr.err) {
                                                            _context2.next = 20;
                                                            break;
                                                        }

                                                        _this3.m_logger.error("verify block failed ", vr.err);
                                                        return _context2.abrupt("return");

                                                    case 20:
                                                        if (vr.verified) {
                                                            _this3.m_consensusNode.agreeProposal(block);
                                                        } else {
                                                            // TODO: 传回去？
                                                        }

                                                    case 21:
                                                    case "end":
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this3);
                                    }));

                                    return function (_x3) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());
                                this.m_consensusNode.on('mineBlock', function () {
                                    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(block, signs) {
                                        var resolve;
                                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        assert(_this3.m_miningBlocks.has(block.hash));
                                                        resolve = _this3.m_miningBlocks.get(block.hash);

                                                        resolve(error_code_1.ErrorCode.RESULT_OK);

                                                    case 3:
                                                    case "end":
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this3);
                                    }));

                                    return function (_x4, _x5) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }());
                                return _context4.abrupt("return", this.m_consensusNode.init());

                            case 21:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function initialize(_x) {
                return _ref.apply(this, arguments);
            }

            return initialize;
        }()
    }, {
        key: "_updateTip",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(tip) {
                var gnmr, gtvr;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.chain.dbftHeaderStorage.getNextMiners(tip);

                            case 2:
                                gnmr = _context5.sent;

                                if (!gnmr.err) {
                                    _context5.next = 6;
                                    break;
                                }

                                this.m_logger.error("dbft miner initialize failed for ", gnmr.err);
                                return _context5.abrupt("return", gnmr.err);

                            case 6:
                                _context5.next = 8;
                                return this.chain.dbftHeaderStorage.getTotalView(tip);

                            case 8:
                                gtvr = _context5.sent;

                                if (!gtvr.err) {
                                    _context5.next = 12;
                                    break;
                                }

                                this.m_logger.error("dbft miner initialize failed for ", gtvr.err);
                                return _context5.abrupt("return", gnmr.err);

                            case 12:
                                this.m_consensusNode.updateTip(tip, gnmr.miners, gtvr.totalView);
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 14:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _updateTip(_x6) {
                return _ref5.apply(this, arguments);
            }

            return _updateTip;
        }()
    }, {
        key: "_onTipBlock",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(chain, tipBlock) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this._updateTip(tipBlock);

                            case 2:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function _onTipBlock(_x7, _x8) {
                return _ref6.apply(this, arguments);
            }

            return _onTipBlock;
        }()
    }, {
        key: "_mineBlock",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(block) {
                var _this4 = this;

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                this.m_logger.info(this.peerid + " create block, sign " + this.m_address);
                                block.header.signBlock(this.m_secret);
                                block.header.updateHash();
                                this.m_consensusNode.newProposal(block);
                                return _context7.abrupt("return", new _promise2.default(function (resolve) {
                                    assert(!_this4.m_miningBlocks.has(block.hash));
                                    if (_this4.m_miningBlocks.has(block.hash)) {
                                        resolve(error_code_1.ErrorCode.RESULT_SKIPPED);
                                        return;
                                    }
                                    _this4.m_miningBlocks.set(block.hash, resolve);
                                }));

                            case 5:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function _mineBlock(_x9) {
                return _ref7.apply(this, arguments);
            }

            return _mineBlock;
        }()
    }, {
        key: "chain",
        get: function get() {
            return this.m_chain;
        }
    }, {
        key: "address",
        get: function get() {
            return this.m_address;
        }
    }]);
    return DbftMiner;
}(value_chain_1.ValueMiner);

exports.DbftMiner = DbftMiner;