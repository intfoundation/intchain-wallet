"use strict";

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

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var error_code_1 = require("../error_code");
var address_1 = require("../address");
var value_chain_1 = require("../value_chain");
var block_1 = require("./block");
var chain_1 = require("./chain");

var DposMiner = function (_value_chain_1$ValueM) {
    (0, _inherits3.default)(DposMiner, _value_chain_1$ValueM);

    function DposMiner() {
        (0, _classCallCheck3.default)(this, DposMiner);
        return (0, _possibleConstructorReturn3.default)(this, (DposMiner.__proto__ || (0, _getPrototypeOf2.default)(DposMiner)).apply(this, arguments));
    }

    (0, _createClass3.default)(DposMiner, [{
        key: "_chainInstance",
        value: function _chainInstance() {
            return new chain_1.DposChain({ logger: this.m_logger });
        }
    }, {
        key: "parseInstanceOptions",
        value: function parseInstanceOptions(node, instanceOptions) {
            var _get$call = (0, _get3.default)(DposMiner.prototype.__proto__ || (0, _getPrototypeOf2.default)(DposMiner.prototype), "parseInstanceOptions", this).call(this, node, instanceOptions),
                err = _get$call.err,
                value = _get$call.value;

            if (err) {
                return { err: err };
            }
            if (!instanceOptions.get('minerSecret')) {
                this.m_logger.error("invalid instance options not minerSecret");
                return { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM };
            }
            value.secret = Buffer.from(instanceOptions.get('minerSecret'), 'hex');
            return { err: error_code_1.ErrorCode.RESULT_OK, value: value };
        }
    }, {
        key: "initialize",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
                var err;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.m_secret = options.secret;
                                this.m_address = address_1.addressFromSecretKey(this.m_secret);

                                if (this.m_address) {
                                    _context.next = 5;
                                    break;
                                }

                                this.m_logger.error("dpos miner init failed for invalid secret");
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_PARAM);

                            case 5:
                                if (!options.coinbase) {
                                    this.coinbase = this.m_address;
                                }
                                assert(this.coinbase, "secret key failed");

                                if (this.m_address) {
                                    _context.next = 9;
                                    break;
                                }

                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_PARAM);

                            case 9:
                                _context.next = 11;
                                return (0, _get3.default)(DposMiner.prototype.__proto__ || (0, _getPrototypeOf2.default)(DposMiner.prototype), "initialize", this).call(this, options);

                            case 11:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 14;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 14:
                                this.m_logger.info("begin Mine...");
                                this._resetTimer();
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 17:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function initialize(_x) {
                return _ref.apply(this, arguments);
            }

            return initialize;
        }()
    }, {
        key: "_resetTimer",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var _this2 = this;

                var tr;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this._nextBlockTimeout();

                            case 2:
                                tr = _context3.sent;

                                if (!tr.err) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt("return", tr.err);

                            case 5:
                                if (this.m_timer) {
                                    clearTimeout(this.m_timer);
                                    delete this.m_timer;
                                }
                                this.m_timer = setTimeout((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                                    var now, tip, blockHeader, dmr;
                                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    delete _this2.m_timer;
                                                    now = Date.now() / 1000;
                                                    tip = _this2.m_chain.tipBlockHeader;
                                                    blockHeader = new block_1.DposBlockHeader();

                                                    blockHeader.setPreBlock(tip);
                                                    blockHeader.timestamp = now;
                                                    _context2.next = 8;
                                                    return blockHeader.getDueMiner(_this2.m_chain);

                                                case 8:
                                                    dmr = _context2.sent;

                                                    if (!dmr.err) {
                                                        _context2.next = 11;
                                                        break;
                                                    }

                                                    return _context2.abrupt("return");

                                                case 11:
                                                    _this2.m_logger.info("calcuted block " + blockHeader.number + " creator: " + dmr.miner);
                                                    if (!dmr.miner) {
                                                        assert(false, 'calcuted undefined block creator!!');
                                                        process.exit(1);
                                                    }

                                                    if (!(_this2.m_address === dmr.miner)) {
                                                        _context2.next = 16;
                                                        break;
                                                    }

                                                    _context2.next = 16;
                                                    return _this2._createBlock(blockHeader);

                                                case 16:
                                                    _this2._resetTimer();

                                                case 17:
                                                case "end":
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, _this2);
                                })), tr.timeout);
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 8:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _resetTimer() {
                return _ref2.apply(this, arguments);
            }

            return _resetTimer;
        }()
    }, {
        key: "_mineBlock",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(block) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                // 只需要给block签名
                                this.m_logger.info(this.peerid + " create block, sign " + this.m_address);
                                block.header.signBlock(this.m_secret);
                                block.header.updateHash();
                                return _context4.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 4:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function _mineBlock(_x2) {
                return _ref4.apply(this, arguments);
            }

            return _mineBlock;
        }()
    }, {
        key: "_nextBlockTimeout",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var hr, now, blockInterval, nextTime;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.m_chain.getHeader(0);

                            case 2:
                                hr = _context5.sent;

                                if (!hr.err) {
                                    _context5.next = 5;
                                    break;
                                }

                                return _context5.abrupt("return", { err: hr.err });

                            case 5:
                                now = Date.now() / 1000;
                                blockInterval = this.m_chain.globalOptions.blockInterval;
                                nextTime = (Math.floor((now - hr.header.timestamp) / blockInterval) + 1) * blockInterval;
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, timeout: (nextTime + hr.header.timestamp - now) * 1000 });

                            case 9:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _nextBlockTimeout() {
                return _ref5.apply(this, arguments);
            }

            return _nextBlockTimeout;
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
    return DposMiner;
}(value_chain_1.ValueMiner);

exports.DposMiner = DposMiner;