"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

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
var path = require("path");
var assert = require("assert");
var error_code_1 = require("../error_code");
var workpool_1 = require("../lib/workpool");
var writer_1 = require("../lib/writer");
var value_chain_1 = require("../value_chain");
var block_1 = require("./block");
var consensus = require("./consensus");
var chain_1 = require("./chain");

var PowMiner = function (_value_chain_1$ValueM) {
    (0, _inherits3.default)(PowMiner, _value_chain_1$ValueM);

    function PowMiner(options) {
        (0, _classCallCheck3.default)(this, PowMiner);

        var _this = (0, _possibleConstructorReturn3.default)(this, (PowMiner.__proto__ || (0, _getPrototypeOf2.default)(PowMiner)).call(this, options));

        var filename = path.resolve(__dirname, 'pow_worker.js');
        _this.workpool = new workpool_1.Workpool(filename, 1);
        return _this;
    }

    (0, _createClass3.default)(PowMiner, [{
        key: "_chainInstance",
        value: function _chainInstance() {
            return new chain_1.PowChain({ logger: this.m_logger });
        }
    }, {
        key: "_newHeader",
        value: function _newHeader() {
            var tip = this.m_chain.tipBlockHeader;
            var blockHeader = new block_1.PowBlockHeader();
            blockHeader.setPreBlock(tip);
            blockHeader.timestamp = Date.now() / 1000;
            return blockHeader;
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
                                if (options.coinbase) {
                                    this.m_coinbase = options.coinbase;
                                }
                                _context.next = 3;
                                return (0, _get3.default)(PowMiner.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowMiner.prototype), "initialize", this).call(this, options);

                            case 3:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 6;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 6:
                                this._createBlock(this._newHeader());
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 8:
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
        key: "_mineBlock",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(block) {
                var tr, ret;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                // 这里计算bits
                                this.m_logger.info(this.peerid + " begin mine Block (" + block.number + ")");
                                _context2.next = 3;
                                return consensus.getTarget(block.header, this.m_chain);

                            case 3:
                                tr = _context2.sent;

                                if (!tr.err) {
                                    _context2.next = 6;
                                    break;
                                }

                                return _context2.abrupt("return", tr.err);

                            case 6:
                                assert(tr.target !== undefined);

                                if (!(tr.target === 0)) {
                                    _context2.next = 10;
                                    break;
                                }

                                console.error("cannot get target bits for block " + block.number);
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_BLOCK);

                            case 10:
                                block.header.bits = tr.target;
                                // 使用一个workerpool来计算正确的nonce
                                _context2.next = 13;
                                return this._calcuteBlockHashWorkpool(block.header, { start: 0, end: consensus.INT32_MAX }, { start: 0, end: consensus.INT32_MAX });

                            case 13:
                                ret = _context2.sent;

                                if (ret === error_code_1.ErrorCode.RESULT_OK) {
                                    block.header.updateHash();
                                    this.m_logger.info(this.peerid + " mined Block (" + block.number + ") target " + block.header.bits + " : " + block.header.hash);
                                }
                                return _context2.abrupt("return", ret);

                            case 16:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _mineBlock(_x2) {
                return _ref2.apply(this, arguments);
            }

            return _mineBlock;
        }()
        /**
         * virtual
         * @param chain
         * @param tipBlock
         */

    }, {
        key: "_onTipBlock",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(chain, tipBlock) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.m_logger.info(this.peerid + " onTipBlock " + tipBlock.number + " : " + tipBlock.hash);
                                if (this.m_state === value_chain_1.MinerState.mining) {
                                    this.m_logger.info(this.peerid + " cancel mining");
                                    this.workpool.stop();
                                }
                                this._createBlock(this._newHeader());

                            case 3:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _onTipBlock(_x3, _x4) {
                return _ref3.apply(this, arguments);
            }

            return _onTipBlock;
        }()
    }, {
        key: "_calcuteBlockHashWorkpool",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(blockHeader, nonceRange, nonce1Range) {
                var _this2 = this;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                return _context4.abrupt("return", new _promise2.default(function (reslove, reject) {
                                    var writer = new writer_1.BufferWriter();
                                    var err = blockHeader.encode(writer);
                                    if (err) {
                                        _this2.m_logger.error("header encode failed ", blockHeader);
                                        reslove(err);
                                        return;
                                    }
                                    var buffer = writer.render();
                                    _this2.workpool.push({ data: buffer, nonce: nonceRange, nonce1: nonce1Range }, function (code, signal, ret) {
                                        if (code === 0) {
                                            var result = JSON.parse(ret);
                                            blockHeader.nonce = result['nonce'];
                                            blockHeader.nonce1 = result['nonce1'];
                                            assert(blockHeader.verifyPOW());
                                            reslove(error_code_1.ErrorCode.RESULT_OK);
                                        } else if (signal === 'SIGTERM') {
                                            reslove(error_code_1.ErrorCode.RESULT_CANCELED);
                                        } else {
                                            _this2.m_logger.error("worker error! code: " + code + ", ret: " + ret);
                                            reslove(error_code_1.ErrorCode.RESULT_FAILED);
                                        }
                                    });
                                }));

                            case 1:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function _calcuteBlockHashWorkpool(_x5, _x6, _x7) {
                return _ref4.apply(this, arguments);
            }

            return _calcuteBlockHashWorkpool;
        }()
    }, {
        key: "chain",
        get: function get() {
            return this.m_chain;
        }
    }]);
    return PowMiner;
}(value_chain_1.ValueMiner);

exports.PowMiner = PowMiner;