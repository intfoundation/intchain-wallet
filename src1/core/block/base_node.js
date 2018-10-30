"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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
var assert = require('assert');
var events_1 = require("events");
var error_code_1 = require("../error_code");
var node_storage_1 = require("./node_storage");
var block_1 = require("./block");

var _require = require('../lib/log_shim'),
    LogShim = _require.LogShim;

var BAN_LEVEL;
(function (BAN_LEVEL) {
    BAN_LEVEL[BAN_LEVEL["minute"] = 1] = "minute";
    BAN_LEVEL[BAN_LEVEL["hour"] = 60] = "hour";
    BAN_LEVEL[BAN_LEVEL["day"] = 1440] = "day";
    BAN_LEVEL[BAN_LEVEL["month"] = 43200] = "month";
    BAN_LEVEL[BAN_LEVEL["forever"] = 0] = "forever";
})(BAN_LEVEL = exports.BAN_LEVEL || (exports.BAN_LEVEL = {}));

var BaseNode = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(BaseNode, _events_1$EventEmitte);

    function BaseNode(options) {
        (0, _classCallCheck3.default)(this, BaseNode);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BaseNode.__proto__ || (0, _getPrototypeOf2.default)(BaseNode)).call(this));

        _this.m_connecting = new _set2.default();
        _this.m_blockHeaderType = options.blockHeaderType;
        _this.m_transactionType = options.transactionType;
        _this.m_node = options.node;
        _this.m_logger = new LogShim(options.logger).bind("[peerid: " + _this.peerid + "]", true).log;
        _this.m_headerStorage = options.headerStorage;
        _this.m_node.on('error', function (conn, err) {
            _this.emit('error', conn.getRemote());
        });
        // 收到net/node的ban事件, 调用 ChainNode的banConnection方法做封禁处理
        // 日期先设置为按天
        _this.m_node.on('ban', function (remote) {
            _this.banConnection(remote, BAN_LEVEL.day);
        });
        _this.m_nodeStorage = new node_storage_1.NodeStorage({
            count: options.nodeCacheSize ? options.nodeCacheSize : 50,
            dataDir: options.dataDir,
            logger: _this.m_logger
        });
        return _this;
    }

    (0, _createClass3.default)(BaseNode, [{
        key: "on",
        value: function on(event, listener) {
            return (0, _get3.default)(BaseNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseNode.prototype), "on", this).call(this, event, listener);
        }
    }, {
        key: "once",
        value: function once(event, listener) {
            return (0, _get3.default)(BaseNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseNode.prototype), "once", this).call(this, event, listener);
        }
    }, {
        key: "prependListener",
        value: function prependListener(event, listener) {
            return (0, _get3.default)(BaseNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseNode.prototype), "prependListener", this).call(this, event, listener);
        }
    }, {
        key: "prependOnceListener",
        value: function prependOnceListener(event, listener) {
            return (0, _get3.default)(BaseNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseNode.prototype), "prependOnceListener", this).call(this, event, listener);
        }
    }, {
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var result, genesis_hash;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.m_headerStorage.getHeader(0);

                            case 2:
                                result = _context.sent;
                                genesis_hash = result.header.hash;

                                this.m_node.genesisHash = genesis_hash;
                                _context.next = 7;
                                return this.m_node.init();

                            case 7:
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
            return this.m_node.uninit();
        }
    }, {
        key: "newTransaction",
        value: function newTransaction() {
            return new this.m_transactionType();
        }
    }, {
        key: "newBlockHeader",
        value: function newBlockHeader() {
            return new this.m_blockHeaderType();
        }
    }, {
        key: "newBlock",
        value: function newBlock(header) {
            var block = new block_1.Block({
                header: header,
                headerType: this.m_blockHeaderType,
                transactionType: this.m_transactionType
            });
            return block;
        }
    }, {
        key: "initialOutbounds",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 1:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function initialOutbounds() {
                return _ref2.apply(this, arguments);
            }

            return initialOutbounds;
        }()
    }, {
        key: "_connectTo",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(willConn, callback) {
                var _this2 = this;

                var ops, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, peer;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (willConn.size) {
                                    _context3.next = 3;
                                    break;
                                }

                                if (callback) {
                                    callback(0);
                                }
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 3:
                                ops = [];
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context3.prev = 7;

                                for (_iterator = (0, _getIterator3.default)(willConn); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    peer = _step.value;

                                    if (this._onWillConnectTo(peer)) {
                                        this.m_connecting.add(peer);
                                        ops.push(this.m_node.connectTo(peer));
                                    }
                                }
                                _context3.next = 15;
                                break;

                            case 11:
                                _context3.prev = 11;
                                _context3.t0 = _context3["catch"](7);
                                _didIteratorError = true;
                                _iteratorError = _context3.t0;

                            case 15:
                                _context3.prev = 15;
                                _context3.prev = 16;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 18:
                                _context3.prev = 18;

                                if (!_didIteratorError) {
                                    _context3.next = 21;
                                    break;
                                }

                                throw _iteratorError;

                            case 21:
                                return _context3.finish(18);

                            case 22:
                                return _context3.finish(15);

                            case 23:
                                if (!(ops.length === 0)) {
                                    _context3.next = 26;
                                    break;
                                }

                                if (callback) {
                                    callback(0);
                                }
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 26:
                                _promise2.default.all(ops).then(function (results) {
                                    var connCount = 0;
                                    var _iteratorNormalCompletion2 = true;
                                    var _didIteratorError2 = false;
                                    var _iteratorError2 = undefined;

                                    try {
                                        for (var _iterator2 = (0, _getIterator3.default)(results), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                            var r = _step2.value;

                                            _this2.m_connecting.delete(r.peerid);
                                            _this2.logger.debug("connect to " + r.peerid + " err: ", r.err);
                                            if (r.conn) {
                                                _this2.m_nodeStorage.add(r.conn.getRemote());
                                                _this2.emit('outbound', r.conn);
                                                ++connCount;
                                            } else {
                                                if (r.err !== error_code_1.ErrorCode.RESULT_ALREADY_EXIST) {
                                                    _this2.m_nodeStorage.remove(r.peerid);
                                                }
                                                if (r.err === error_code_1.ErrorCode.RESULT_VER_NOT_SUPPORT) {
                                                    _this2.m_nodeStorage.ban(r.peerid, BAN_LEVEL.month);
                                                }
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError2 = true;
                                        _iteratorError2 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                _iterator2.return();
                                            }
                                        } finally {
                                            if (_didIteratorError2) {
                                                throw _iteratorError2;
                                            }
                                        }
                                    }

                                    if (callback) {
                                        callback(connCount);
                                    }
                                });
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 28:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[7, 11, 15, 23], [16,, 18, 22]]);
            }));

            function _connectTo(_x, _x2) {
                return _ref3.apply(this, arguments);
            }

            return _connectTo;
        }()
    }, {
        key: "listen",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var _this3 = this;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                this.m_node.on('inbound', function (inbound) {
                                    if (_this3.m_nodeStorage.isBan(inbound.getRemote())) {
                                        _this3.logger.warn("new inbound from " + inbound.getRemote() + " ignored for ban");
                                        _this3.m_node.closeConnection(inbound);
                                    } else {
                                        _this3.logger.info("new inbound from ", inbound.getRemote());
                                        _this3.emit('inbound', inbound);
                                    }
                                });
                                _context4.next = 3;
                                return this.m_node.listen();

                            case 3:
                                return _context4.abrupt("return", _context4.sent);

                            case 4:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function listen() {
                return _ref4.apply(this, arguments);
            }

            return listen;
        }()
    }, {
        key: "banConnection",
        value: function banConnection(remote, level) {
            this.m_logger.warn("banned peer " + remote + " for " + level);
            this.m_nodeStorage.ban(remote, level);
            this.m_node.banConnection(remote);
            this.emit('ban', remote);
        }
    }, {
        key: "_onWillConnectTo",
        value: function _onWillConnectTo(peerid) {
            if (this.m_nodeStorage.isBan(peerid)) {
                return false;
            }
            if (this.m_node.getConnection(peerid)) {
                return false;
            }
            if (this.m_connecting.has(peerid)) {
                return false;
            }
            return true;
        }
    }, {
        key: "logger",
        get: function get() {
            return this.m_logger;
        }
    }, {
        key: "node",
        get: function get() {
            return this.m_node;
        }
    }, {
        key: "peerid",
        get: function get() {
            return this.m_node.peerid;
        }
    }, {
        key: "headerStorage",
        get: function get() {
            return this.m_headerStorage;
        }
    }]);
    return BaseNode;
}(events_1.EventEmitter);

exports.BaseNode = BaseNode;