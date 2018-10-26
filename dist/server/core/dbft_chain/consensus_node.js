"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

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
var events_1 = require("events");
var assert = require('assert');
var error_code_1 = require("../error_code");
var writer_1 = require("../lib/writer");
var chain_1 = require("../chain");
var block_1 = require("./block");
var context_1 = require("./context");
var reader_1 = require("../lib/reader");
var libAddress = require("../address");
var DBFT_SYNC_CMD_TYPE;
(function (DBFT_SYNC_CMD_TYPE) {
    DBFT_SYNC_CMD_TYPE[DBFT_SYNC_CMD_TYPE["prepareRequest"] = 23] = "prepareRequest";
    DBFT_SYNC_CMD_TYPE[DBFT_SYNC_CMD_TYPE["prepareResponse"] = 24] = "prepareResponse";
    DBFT_SYNC_CMD_TYPE[DBFT_SYNC_CMD_TYPE["changeview"] = 25] = "changeview";
    DBFT_SYNC_CMD_TYPE[DBFT_SYNC_CMD_TYPE["end"] = 26] = "end";
})(DBFT_SYNC_CMD_TYPE = exports.DBFT_SYNC_CMD_TYPE || (exports.DBFT_SYNC_CMD_TYPE = {}));
var ConsensusState;
(function (ConsensusState) {
    ConsensusState[ConsensusState["none"] = 0] = "none";
    ConsensusState[ConsensusState["waitingCreate"] = 1] = "waitingCreate";
    ConsensusState[ConsensusState["waitingProposal"] = 3] = "waitingProposal";
    ConsensusState[ConsensusState["waitingVerify"] = 4] = "waitingVerify";
    ConsensusState[ConsensusState["waitingAgree"] = 5] = "waitingAgree";
    ConsensusState[ConsensusState["waitingBlock"] = 6] = "waitingBlock";
    ConsensusState[ConsensusState["changeViewSent"] = 10] = "changeViewSent";
})(ConsensusState || (ConsensusState = {}));

var DbftConsensusNode = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(DbftConsensusNode, _events_1$EventEmitte);

    function DbftConsensusNode(options) {
        (0, _classCallCheck3.default)(this, DbftConsensusNode);

        var _this = (0, _possibleConstructorReturn3.default)(this, (DbftConsensusNode.__proto__ || (0, _getPrototypeOf2.default)(DbftConsensusNode)).call(this));

        _this.m_node = options.node;
        _this.m_globalOptions = options.globalOptions;
        _this.m_state = ConsensusState.none;
        _this.m_secret = options.secret;
        _this.m_address = libAddress.addressFromSecretKey(_this.m_secret);
        _this.m_pubkey = libAddress.publicKeyFromSecretKey(_this.m_secret);
        return _this;
    }

    (0, _createClass3.default)(DbftConsensusNode, [{
        key: "on",
        value: function on(event, listener) {
            return (0, _get3.default)(DbftConsensusNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftConsensusNode.prototype), "on", this).call(this, event, listener);
        }
    }, {
        key: "once",
        value: function once(event, listener) {
            return (0, _get3.default)(DbftConsensusNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftConsensusNode.prototype), "once", this).call(this, event, listener);
        }
    }, {
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var hr, err;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.m_node.init();

                            case 2:
                                _context.next = 4;
                                return this.m_node.headerStorage.getHeader(0);

                            case 4:
                                hr = _context.sent;

                                if (!hr.err) {
                                    _context.next = 8;
                                    break;
                                }

                                this.logger.error("dbft consensus node init failed for " + hr.err);
                                return _context.abrupt("return", hr.err);

                            case 8:
                                this.m_genesisTime = hr.header.timestamp;
                                _context.next = 11;
                                return this.m_node.initialOutbounds();

                            case 11:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 15;
                                    break;
                                }

                                this.logger.error("dbft consensus node init failed for " + err);
                                return _context.abrupt("return", err);

                            case 15:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 16:
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
        key: "_cancel",
        value: function _cancel() {
            this.m_state = ConsensusState.none;
            this.m_context = undefined;
            this._resetTimer();
        }
    }, {
        key: "updateTip",
        value: function updateTip(header, nextMiners, totalView) {
            // TODO: 这里还需要比较两个header 的work，只有大的时候覆盖
            if (!this.m_tip || this.m_tip.header.hash !== header.hash) {
                this.m_tip = {
                    header: header,
                    nextMiners: nextMiners,
                    totalView: totalView
                };
                if (this.m_state !== ConsensusState.none) {
                    this.logger.warn("dbft conensus update tip when in consensus ", this.m_context);
                    this._cancel();
                } else {
                    this._resetTimer();
                }
                this.m_node.setValidators(nextMiners);
            }
        }
    }, {
        key: "agreeProposal",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(block) {
                var curContext, sign;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.m_state !== ConsensusState.waitingVerify)) {
                                    _context2.next = 3;
                                    break;
                                }

                                this.logger.warn("skip agreeProposal in state ", this.m_state);
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 3:
                                curContext = this.m_context;

                                assert(curContext && curContext.block && curContext.from);

                                if (!(!curContext || !curContext.block || !curContext.from)) {
                                    _context2.next = 8;
                                    break;
                                }

                                this.logger.error("agreeProposal in invalid context ", curContext);
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 8:
                                if (curContext.block.header.isPreBlock(block.header)) {
                                    _context2.next = 11;
                                    break;
                                }

                                this.logger.error("agreeProposal block " + block.header + " " + block.number + " in invalid context block " + curContext.block.hash + " " + curContext.block.number);
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 11:
                                sign = libAddress.sign(block.hash, this.m_secret);

                                this._sendPrepareResponse(curContext.from, curContext.block, sign);
                                // TODO?要进入什么状态?
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 14:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function agreeProposal(_x) {
                return _ref2.apply(this, arguments);
            }

            return agreeProposal;
        }()
    }, {
        key: "newProposal",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(block) {
                var curContext;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                assert(this.m_tip);

                                if (this.m_tip) {
                                    _context3.next = 3;
                                    break;
                                }

                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 3:
                                if (!(this.m_state !== ConsensusState.waitingCreate)) {
                                    _context3.next = 6;
                                    break;
                                }

                                this.logger.warn("dbft conensus newProposal " + block.header.hash + "  " + block.header.number + " while not in waitingCreate state");
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 6:
                                if (this.m_tip.header.isPreBlock(block.header)) {
                                    _context3.next = 9;
                                    break;
                                }

                                this.logger.warn("dbft conensus newProposal " + block.header.hash + "  " + block.header.number + " while in another context " + this.m_tip.header.hash + " " + this.m_tip.header.number);
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 9:
                                this._sendPrepareRequest(block);
                                this.m_state = ConsensusState.waitingAgree;
                                curContext = {
                                    curView: 0,
                                    block: block,
                                    signs: new _map2.default()
                                };

                                this.m_context = curContext;
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 14:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function newProposal(_x2) {
                return _ref3.apply(this, arguments);
            }

            return newProposal;
        }()
    }, {
        key: "_resetTimer",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var _this2 = this;

                var tr;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this._nextTimeout();

                            case 2:
                                tr = _context5.sent;

                                if (!(tr.err === error_code_1.ErrorCode.RESULT_SKIPPED)) {
                                    _context5.next = 5;
                                    break;
                                }

                                return _context5.abrupt("return", tr.err);

                            case 5:
                                if (this.m_timer) {
                                    clearTimeout(this.m_timer);
                                    delete this.m_timer;
                                }
                                this.m_timer = setTimeout((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                                        while (1) {
                                            switch (_context4.prev = _context4.next) {
                                                case 0:
                                                    delete _this2.m_timer;
                                                    _this2._resetTimer();
                                                    _this2._onTimeout();

                                                case 3:
                                                case "end":
                                                    return _context4.stop();
                                            }
                                        }
                                    }, _callee4, _this2);
                                })), tr.timeout);
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 8:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _resetTimer() {
                return _ref4.apply(this, arguments);
            }

            return _resetTimer;
        }()
    }, {
        key: "_isOneOfMiner",
        value: function _isOneOfMiner() {
            return this.m_tip.nextMiners.indexOf(this.m_address) >= 0;
        }
    }, {
        key: "_onTimeout",
        value: function _onTimeout() {
            assert(this.m_tip);
            if (!this.m_tip) {
                this.logger.warn("bdft consensus has no tip when time out");
                return;
            }
            if (this.m_state === ConsensusState.none) {
                if (!this._isOneOfMiner()) {
                    this.logger.debug("bdft consensus is not one of miner when time out");
                    return;
                }
                var due = context_1.DbftContext.getDueNextMiner(this.m_globalOptions, this.m_tip.header, this.m_tip.nextMiners, 0);
                if (this.m_address === due) {
                    this.m_state = ConsensusState.waitingCreate;
                    var newContext = {
                        curView: 0
                    };
                    this.m_context = newContext;
                    var now = Date.now() / 1000;
                    var blockHeader = new block_1.DbftBlockHeader();
                    blockHeader.setPreBlock(this.m_tip.header);
                    blockHeader.timestamp = now;
                    this.logger.debug("bdft consensus enter waitingCreate " + blockHeader.hash + " " + blockHeader.number);
                    this.emit('createBlock', blockHeader);
                } else {
                    this.m_state = ConsensusState.waitingProposal;
                    var _newContext = {
                        curView: 0
                    };
                    this.m_context = _newContext;
                    this.logger.debug("bdft consensus enter waitingProposal " + this.m_tip.header.hash + " " + this.m_tip.header.number);
                }
            } else if (this.m_state === ConsensusState.waitingAgree) {
                // 超时未能达成共识，触发提升view
            } else {
                // TODO:
                assert(false);
            }
        }
    }, {
        key: "_sendPrepareRequest",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(block) {
                var writer, err, data, pkg;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                writer = new writer_1.BufferWriter();
                                err = block.encode(writer);
                                data = writer.render();
                                pkg = chain_1.PackageStreamWriter.fromPackage(DBFT_SYNC_CMD_TYPE.prepareRequest, {}, data.length).writeData(data);

                                this.m_node.broadcastToValidators(pkg);

                            case 5:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function _sendPrepareRequest(_x3) {
                return _ref6.apply(this, arguments);
            }

            return _sendPrepareRequest;
        }()
    }, {
        key: "_sendPrepareResponse",
        value: function _sendPrepareResponse(to, block, sign) {
            var writer = new writer_1.BufferWriter();
            writer.writeBytes(this.m_pubkey);
            writer.writeBytes(sign);
            var data = writer.render();
            var pkg = chain_1.PackageStreamWriter.fromPackage(DBFT_SYNC_CMD_TYPE.prepareResponse, { hash: block.hash }, data.length).writeData(data);
            to.addPendingWriter(pkg);
        }
    }, {
        key: "_beginSyncWithNode",
        value: function _beginSyncWithNode(conn) {
            var _this3 = this;

            conn.on('pkg', function () {
                var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(pkg) {
                    var block, reader, err, hash, _reader, pubkey, sign;

                    return _regenerator2.default.wrap(function _callee7$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    if (!(pkg.header.cmdType === DBFT_SYNC_CMD_TYPE.prepareRequest)) {
                                        _context7.next = 16;
                                        break;
                                    }

                                    block = _this3.base.newBlock();
                                    reader = new reader_1.BufferReader(pkg.copyData());
                                    err = block.decode(reader);

                                    if (!err) {
                                        _context7.next = 7;
                                        break;
                                    }

                                    // TODO: ban it
                                    // this.base.banConnection();
                                    _this3.logger.error("recv invalid prepareRequest from ", conn.getRemote());
                                    return _context7.abrupt("return");

                                case 7:
                                    if (block.header.verifySign()) {
                                        _context7.next = 10;
                                        break;
                                    }

                                    // TODO: ban it
                                    // this.base.banConnection();
                                    _this3.logger.error("recv invalid signature prepareRequest from ", conn.getRemote());
                                    return _context7.abrupt("return");

                                case 10:
                                    if (block.verify()) {
                                        _context7.next = 13;
                                        break;
                                    }

                                    // TODO: ban it
                                    // this.base.banConnection();
                                    _this3.logger.error("recv invalid block in prepareRequest from ", conn.getRemote());
                                    return _context7.abrupt("return");

                                case 13:
                                    _this3._onPrepareRequest(conn, { block: block });
                                    _context7.next = 40;
                                    break;

                                case 16:
                                    if (!(pkg.header.cmdType === DBFT_SYNC_CMD_TYPE.prepareResponse)) {
                                        _context7.next = 39;
                                        break;
                                    }

                                    hash = pkg.body.hash;
                                    _reader = new reader_1.BufferReader(pkg.copyData());
                                    pubkey = void 0;
                                    sign = void 0;
                                    _context7.prev = 21;

                                    pubkey = _reader.readBytes(33);
                                    sign = _reader.readBytes(64);
                                    _context7.next = 30;
                                    break;

                                case 26:
                                    _context7.prev = 26;
                                    _context7.t0 = _context7["catch"](21);

                                    // TODO: ban it
                                    // this.base.banConnection();
                                    _this3.logger.error("decode prepareResponse failed ", _context7.t0);
                                    return _context7.abrupt("return");

                                case 30:
                                    if (libAddress.verify(hash, sign, pubkey)) {
                                        _context7.next = 33;
                                        break;
                                    }

                                    // TODO: ban it
                                    // this.base.banConnection();
                                    _this3.logger.error("prepareResponse verify sign invalid");
                                    return _context7.abrupt("return");

                                case 33:
                                    if (!(libAddress.addressFromPublicKey(pubkey) === _this3.m_address)) {
                                        _context7.next = 36;
                                        break;
                                    }

                                    // TODO: ban it
                                    // this.base.banConnection();
                                    _this3.logger.error("prepareResponse got my sign");
                                    return _context7.abrupt("return");

                                case 36:
                                    _this3._onPrepareResponse(conn, { hash: hash, pubkey: pubkey, sign: sign });
                                    _context7.next = 40;
                                    break;

                                case 39:
                                    if (pkg.header.cmdType === DBFT_SYNC_CMD_TYPE.changeview) {
                                        _this3.emit('changeview', pkg.body);
                                    }

                                case 40:
                                case "end":
                                    return _context7.stop();
                            }
                        }
                    }, _callee7, _this3, [[21, 26]]);
                }));

                return function (_x4) {
                    return _ref7.apply(this, arguments);
                };
            }());
        }
    }, {
        key: "_onPrepareRequest",
        value: function _onPrepareRequest(from, pkg) {
            if (!this.m_tip) {
                this.logger.warn("_onPrepareRequest while no tip");
                return;
            }
            if (this.m_state === ConsensusState.waitingProposal) {
                assert(this.m_context);
                var curContext = this.m_context;
                if (!this.m_tip.header.isPreBlock(pkg.block.header)) {
                    this.logger.debug("_onPrepareRequest got block " + pkg.block.header.hash + " " + pkg.block.header.number + " while tip is " + this.m_tip.header.hash + " " + this.m_tip.header.number);
                    return;
                }
                var header = pkg.block.header;
                if (curContext.curView !== header.view) {
                    // 有可能漏了change view，两边view 不一致
                    this.logger.debug("_onPrepareRequest got block " + header.hash + " " + header.number + " " + header.view + " while cur view is " + curContext.curView);
                    return;
                }
                var due = context_1.DbftContext.getDueNextMiner(this.m_globalOptions, this.m_tip.header, this.m_tip.nextMiners, curContext.curView);
                if (header.miner !== due) {
                    // TODO: ban it
                    // this.base.banConnection();
                    this.logger.error("recv prepareRequest's block " + pkg.block.header.hash + " " + pkg.block.header.number + " " + header.miner + " not match due miner " + due);
                    return;
                }
                this.m_state = ConsensusState.waitingVerify;
                var newContext = {
                    curView: curContext.curView,
                    block: pkg.block,
                    from: from
                };
                this.m_context = newContext;
                this.logger.debug("bdft consensus enter waitingVerify " + header.hash + " " + header.number);
                this.emit('verifyBlock', pkg.block);
            } else {
                // 其他状态都忽略
                this.logger.warn("_onPrepareRequest in invalid state ", this.m_state);
            }
        }
    }, {
        key: "_onPrepareResponse",
        value: function _onPrepareResponse(from, pkg) {
            if (!this.m_tip) {
                this.logger.warn("_onPrepareResponse while no tip");
                return;
            }
            if (this.m_state === ConsensusState.waitingAgree) {
                assert(this.m_context);
                var curContext = this.m_context;
                if (curContext.block.hash !== pkg.hash) {
                    this.logger.warn("_onPrepareResponse got " + pkg.hash + " while waiting " + curContext.block.hash);
                    return;
                }
                var address = libAddress.addressFromPublicKey(pkg.pubkey);
                if (this.m_tip.nextMiners.indexOf(address) < 0) {
                    this.logger.warn("_onPrepareResponse got " + address + " 's sign not in next miners");
                    // TODO: ban it
                    // this.base.banConnection();
                    return;
                }
                if (curContext.signs.has(address)) {
                    this.logger.warn("_onPrepareResponse got " + address + " 's duplicated sign");
                    return;
                }
                curContext.signs.set(address, { pubkey: pkg.pubkey, sign: pkg.pubkey });
                if (context_1.DbftContext.isAgreeRateReached(this.m_globalOptions, this.m_tip.nextMiners.length, curContext.signs.size + 1)) {
                    this.logger.info("bdft consensus node enter state waitingBlock " + curContext.block.hash + " " + curContext.block.number);
                    this.m_state = ConsensusState.waitingBlock;
                    var signs = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = (0, _getIterator3.default)(curContext.signs.values()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var s = _step.value;

                            signs.push(s);
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

                    this.emit('mineBlock', curContext.block, signs);
                }
            } else {
                // 其他状态都忽略
                this.logger.warn("_onPrepareResponse in invalid state ", this.m_state);
            }
        }
    }, {
        key: "_nextTimeout",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                var blockInterval, intervalCount, nextTime, now;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (this.m_tip) {
                                    _context8.next = 2;
                                    break;
                                }

                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_SKIPPED });

                            case 2:
                                blockInterval = this.m_globalOptions.blockInterval;
                                intervalCount = this.m_tip.totalView;

                                if (this.m_context) {
                                    intervalCount += Math.pow(2, this.m_context.curView);
                                } else {
                                    intervalCount += 1;
                                }
                                nextTime = this.m_genesisTime + intervalCount * blockInterval;
                                now = Date.now() / 1000;

                                if (!(nextTime > now)) {
                                    _context8.next = 11;
                                    break;
                                }

                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, timeout: (nextTime - now) * 1000 });

                            case 11:
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_SKIPPED });

                            case 12:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function _nextTimeout() {
                return _ref8.apply(this, arguments);
            }

            return _nextTimeout;
        }()
    }, {
        key: "base",
        get: function get() {
            return this.m_node;
        }
    }, {
        key: "logger",
        get: function get() {
            return this.m_node.logger;
        }
    }]);
    return DbftConsensusNode;
}(events_1.EventEmitter);

exports.DbftConsensusNode = DbftConsensusNode;