"use strict";

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

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
var error_code_1 = require("../error_code");
var connection_1 = require("./connection");
var writer_1 = require("./writer");
var reader_1 = require("./reader");
var events_1 = require("events");
var assert = require('assert');
var version_1 = require("./version");
var reader_2 = require("../lib/reader");
var writer_2 = require("../lib/writer");
var logger_util_1 = require("../lib/logger_util");
var CMD_TYPE;
(function (CMD_TYPE) {
    CMD_TYPE[CMD_TYPE["version"] = 1] = "version";
    CMD_TYPE[CMD_TYPE["versionAck"] = 2] = "versionAck";
    CMD_TYPE[CMD_TYPE["userCmd"] = 16] = "userCmd";
})(CMD_TYPE = exports.CMD_TYPE || (exports.CMD_TYPE = {}));

var INode = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(INode, _events_1$EventEmitte);

    function INode(options) {
        (0, _classCallCheck3.default)(this, INode);

        var _this = (0, _possibleConstructorReturn3.default)(this, (INode.__proto__ || (0, _getPrototypeOf2.default)(INode)).call(this));

        _this.m_inConn = [];
        _this.m_outConn = [];
        _this.m_remoteMap = new _map2.default();
        _this.m_peerid = options.peerid;
        _this.m_logger = logger_util_1.initLogger(options);
        return _this;
    }

    (0, _createClass3.default)(INode, [{
        key: "randomPeers",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(count, excludes) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NO_IMP, peers: [] });

                            case 1:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function randomPeers(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return randomPeers;
        }()
    }, {
        key: "init",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function init() {
                return _ref2.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "uninit",
        value: function uninit() {
            this.removeAllListeners('inbound');
            this.removeAllListeners('error');
            this.removeAllListeners('ban');
            var ops = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.m_inConn), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var conn = _step.value;

                    ops.push(conn.destroy());
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

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(this.m_outConn), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _conn2 = _step2.value;

                    ops.push(_conn2.destroy());
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

            this.m_inConn = [];
            this.m_outConn = [];
            this.m_remoteMap.clear();
            return _promise2.default.all(ops);
        }
    }, {
        key: "listen",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_NO_IMP);

                            case 1:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function listen() {
                return _ref3.apply(this, arguments);
            }

            return listen;
        }()
    }, {
        key: "connectTo",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(peerid) {
                var _this2 = this;

                var result, conn, ver, err, other;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._connectTo(peerid);

                            case 2:
                                result = _context4.sent;

                                if (result.conn) {
                                    _context4.next = 5;
                                    break;
                                }

                                return _context4.abrupt("return", { err: result.err, peerid: peerid });

                            case 5:
                                conn = result.conn;

                                conn.setRemote(peerid);
                                ver = new version_1.Version();

                                conn.version = ver;

                                if (!(!this.m_genesis || !this.m_peerid)) {
                                    _context4.next = 13;
                                    break;
                                }

                                this.m_logger.error("connectTo failed for genesis or peerid not set");
                                assert(false, this.m_peerid + " has not set genesis");
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_STATE, peerid: peerid });

                            case 13:
                                ver.genesis = this.m_genesis;
                                ver.peerid = this.m_peerid;
                                _context4.next = 17;
                                return new _promise2.default(function (resolve) {
                                    conn.once('pkg', function (pkg) {
                                        conn.removeListener('error', fn);
                                        if (pkg.header.cmdType === CMD_TYPE.versionAck) {
                                            if (pkg.body.isSupport) {
                                                // 忽略网络传输时间
                                                var nTimeDelta = pkg.body.timestamp - Date.now();
                                                conn.setTimeDelta(nTimeDelta);
                                                resolve(error_code_1.ErrorCode.RESULT_OK);
                                            } else {
                                                conn.close();
                                                resolve(error_code_1.ErrorCode.RESULT_VER_NOT_SUPPORT);
                                            }
                                        } else {
                                            conn.close();
                                            resolve(error_code_1.ErrorCode.RESULT_INVALID_STATE);
                                        }
                                    });
                                    var writer = new writer_2.BufferWriter();
                                    var encodeErr = ver.encode(writer);
                                    if (encodeErr) {
                                        _this2.m_logger.error("version instance encode failed ", ver);
                                        resolve(encodeErr);
                                        return;
                                    }
                                    var buf = writer.render();
                                    var verWriter = writer_1.PackageStreamWriter.fromPackage(CMD_TYPE.version, {}, buf.length).writeData(buf);
                                    conn.addPendingWriter(verWriter);
                                    var fn = function fn(_conn, _err) {
                                        _conn.close();
                                        resolve(_err);
                                    };
                                    conn.once('error', fn);
                                });

                            case 17:
                                err = _context4.sent;

                                if (!err) {
                                    _context4.next = 20;
                                    break;
                                }

                                return _context4.abrupt("return", { err: err, peerid: peerid });

                            case 20:
                                other = this.getConnection(peerid);

                                if (!other) {
                                    _context4.next = 28;
                                    break;
                                }

                                if (!(conn.version.compare(other.version) > 0)) {
                                    _context4.next = 27;
                                    break;
                                }

                                conn.close();
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_ALREADY_EXIST, peerid: peerid });

                            case 27:
                                this.closeConnection(other);

                            case 28:
                                this.m_outConn.push(result.conn);
                                this.m_remoteMap.set(peerid, result.conn);
                                conn.on('error', function (_conn, _err) {
                                    _this2.closeConnection(result.conn);
                                    _this2.emit('error', result.conn, _err);
                                });
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, peerid: peerid, conn: conn });

                            case 32:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function connectTo(_x3) {
                return _ref4.apply(this, arguments);
            }

            return connectTo;
        }()
    }, {
        key: "broadcast",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(writer, options) {
                var nSend, nMax, sended, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, conn, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _conn3;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                nSend = 0;
                                nMax = 999999999;

                                if (options && options.count) {
                                    nMax = options.count;
                                }
                                sended = new _map2.default();
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context5.prev = 7;
                                _iterator3 = (0, _getIterator3.default)(this.m_inConn);

                            case 9:
                                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                    _context5.next = 19;
                                    break;
                                }

                                conn = _step3.value;

                                if (!(nSend === nMax)) {
                                    _context5.next = 13;
                                    break;
                                }

                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, count: nSend });

                            case 13:
                                if (!sended.has(conn.getRemote())) {
                                    _context5.next = 15;
                                    break;
                                }

                                return _context5.abrupt("continue", 16);

                            case 15:
                                if (!options || !options.filter || options.filter(conn)) {
                                    conn.addPendingWriter(writer.clone());
                                    nSend++;
                                    sended.set(conn.getRemote(), 1);
                                }

                            case 16:
                                _iteratorNormalCompletion3 = true;
                                _context5.next = 9;
                                break;

                            case 19:
                                _context5.next = 25;
                                break;

                            case 21:
                                _context5.prev = 21;
                                _context5.t0 = _context5["catch"](7);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context5.t0;

                            case 25:
                                _context5.prev = 25;
                                _context5.prev = 26;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 28:
                                _context5.prev = 28;

                                if (!_didIteratorError3) {
                                    _context5.next = 31;
                                    break;
                                }

                                throw _iteratorError3;

                            case 31:
                                return _context5.finish(28);

                            case 32:
                                return _context5.finish(25);

                            case 33:
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context5.prev = 36;
                                _iterator4 = (0, _getIterator3.default)(this.m_outConn);

                            case 38:
                                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                    _context5.next = 48;
                                    break;
                                }

                                _conn3 = _step4.value;

                                if (!(nSend === nMax)) {
                                    _context5.next = 42;
                                    break;
                                }

                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, count: nSend });

                            case 42:
                                if (!sended.has(_conn3.getRemote())) {
                                    _context5.next = 44;
                                    break;
                                }

                                return _context5.abrupt("continue", 45);

                            case 44:
                                if (!options || !options.filter || options.filter(_conn3)) {
                                    _conn3.addPendingWriter(writer.clone());
                                    nSend++;
                                    sended.set(_conn3.getRemote(), 1);
                                }

                            case 45:
                                _iteratorNormalCompletion4 = true;
                                _context5.next = 38;
                                break;

                            case 48:
                                _context5.next = 54;
                                break;

                            case 50:
                                _context5.prev = 50;
                                _context5.t1 = _context5["catch"](36);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context5.t1;

                            case 54:
                                _context5.prev = 54;
                                _context5.prev = 55;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 57:
                                _context5.prev = 57;

                                if (!_didIteratorError4) {
                                    _context5.next = 60;
                                    break;
                                }

                                throw _iteratorError4;

                            case 60:
                                return _context5.finish(57);

                            case 61:
                                return _context5.finish(54);

                            case 62:
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, count: nSend });

                            case 63:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[7, 21, 25, 33], [26,, 28, 32], [36, 50, 54, 62], [55,, 57, 61]]);
            }));

            function broadcast(_x4, _x5) {
                return _ref5.apply(this, arguments);
            }

            return broadcast;
        }()
    }, {
        key: "isInbound",
        value: function isInbound(conn) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(this.m_inConn), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var c = _step5.value;

                    if (c === conn) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return false;
        }
    }, {
        key: "getOutbounds",
        value: function getOutbounds() {
            var c = this.m_outConn;
            return c;
        }
    }, {
        key: "getInbounds",
        value: function getInbounds() {
            var c = this.m_inConn;
            return c;
        }
    }, {
        key: "getConnnectionCount",
        value: function getConnnectionCount() {
            return this.m_outConn.length + this.m_inConn.length;
        }
    }, {
        key: "getConnection",
        value: function getConnection(remote) {
            return this.m_remoteMap.get(remote);
        }
    }, {
        key: "isOutbound",
        value: function isOutbound(conn) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = (0, _getIterator3.default)(this.m_outConn), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var c = _step6.value;

                    if (c === conn) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return false;
        }
    }, {
        key: "banConnection",
        value: function banConnection(remote) {
            // TODO: 要写到一个什么地方，禁多久，忽略这个peer
            var conn = this.m_remoteMap.get(remote);
            if (conn) {
                this.closeConnection(conn, true);
            }
        }
    }, {
        key: "closeConnection",
        value: function closeConnection(conn) {
            var destroy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            conn.removeAllListeners('error');
            conn.removeAllListeners('pkg');
            var index = 0;
            do {
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = (0, _getIterator3.default)(this.m_outConn), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var c = _step7.value;

                        if (c === conn) {
                            this.m_outConn.splice(index, 1);
                            break;
                        }
                        index++;
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                index = 0;
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = (0, _getIterator3.default)(this.m_inConn), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var _c = _step8.value;

                        if (_c === conn) {
                            this.m_inConn.splice(index, 1);
                            break;
                        }
                        index++;
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            } while (false);
            this.m_remoteMap.delete(conn.getRemote());
            if (destroy) {
                conn.destroy();
            } else {
                conn.close();
            }
        }
    }, {
        key: "on",
        value: function on(event, listener) {
            return (0, _get3.default)(INode.prototype.__proto__ || (0, _getPrototypeOf2.default)(INode.prototype), "on", this).call(this, event, listener);
        }
    }, {
        key: "once",
        value: function once(event, listener) {
            return (0, _get3.default)(INode.prototype.__proto__ || (0, _getPrototypeOf2.default)(INode.prototype), "once", this).call(this, event, listener);
        }
    }, {
        key: "_onInbound",
        value: function _onInbound(inbound) {
            var _this3 = this;

            inbound.once('pkg', function (pkg) {
                inbound.removeListener('error', fn);
                if (pkg.header.cmdType === CMD_TYPE.version) {
                    var buff = pkg.data[0];
                    var dataReader = new reader_2.BufferReader(buff);
                    var ver = new version_1.Version();
                    inbound.version = ver;
                    var err = ver.decode(dataReader);
                    if (err) {
                        _this3.m_logger.warn("recv version in invalid format from " + inbound.getRemote() + " ");
                        inbound.close();
                        return;
                    }
                    // 检查对方包里的genesis_hash是否对应得上
                    if (ver.genesis !== _this3.m_genesis) {
                        _this3.m_logger.warn("recv version genesis " + ver.genesis + " not match " + _this3.m_genesis + " from " + inbound.getRemote() + " ");
                        inbound.close();
                        return;
                    }
                    // 忽略网络传输时间
                    var nTimeDelta = ver.timestamp - Date.now();
                    inbound.setRemote(ver.peerid);
                    inbound.setTimeDelta(nTimeDelta);
                    var isSupport = true;
                    var ackWriter = writer_1.PackageStreamWriter.fromPackage(CMD_TYPE.versionAck, { isSupport: isSupport, timestamp: Date.now() }, 0);
                    inbound.addPendingWriter(ackWriter);
                    if (!isSupport) {
                        inbound.close();
                        return;
                    }
                    var other = _this3.getConnection(inbound.getRemote());
                    if (other) {
                        if (inbound.version.compare(other.version) > 0) {
                            inbound.close();
                            return;
                        } else {
                            _this3.closeConnection(other);
                        }
                    }
                    _this3.m_inConn.push(inbound);
                    _this3.m_remoteMap.set(ver.peerid, inbound);
                    inbound.on('error', function (conn, _err) {
                        _this3.closeConnection(inbound);
                        _this3.emit('error', inbound, _err);
                    });
                    _this3.emit('inbound', inbound);
                } else {
                    inbound.close();
                }
            });
            var fn = function fn() {
                inbound.close();
            };
            inbound.once('error', fn);
        }
    }, {
        key: "_connectTo",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(peerid) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NO_IMP });

                            case 1:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function _connectTo(_x7) {
                return _ref6.apply(this, arguments);
            }

            return _connectTo;
        }()
    }, {
        key: "_connectionType",
        value: function _connectionType() {
            return connection_1.IConnection;
        }
    }, {
        key: "_nodeConnectionType",
        value: function _nodeConnectionType() {
            var superClass = this._connectionType();
            return function (_superClass) {
                (0, _inherits3.default)(_class, _superClass);

                function _class() {
                    var _ref7;

                    (0, _classCallCheck3.default)(this, _class);

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    assert(args.length);
                    var thisNode = args[0];

                    var _this4 = (0, _possibleConstructorReturn3.default)(this, (_ref7 = _class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call.apply(_ref7, [this].concat((0, _toConsumableArray3.default)(args.slice(1)))));

                    _this4.m_pendingWriters = [];
                    _this4.m_reader = new reader_1.PackageStreamReader();
                    _this4.m_reader.start(_this4);
                    _this4.m_reader.on('pkg', function (pkg) {
                        (0, _get3.default)(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "emit", _this4).call(_this4, 'pkg', pkg);
                    });
                    // 接收到 reader的传出来的error 事件后, emit ban事件, 给上层的chain_node去做处理
                    // 这里只需要emit给上层, 最好不要处理其他逻辑
                    _this4.m_reader.on('error', function (err, column) {
                        var remote = _this4.getRemote();
                        thisNode.emit('ban', remote);
                    });
                    return _this4;
                }

                (0, _createClass3.default)(_class, [{
                    key: "addPendingWriter",
                    value: function addPendingWriter(writer) {
                        var _this5 = this;

                        var onFinish = function onFinish() {
                            var _writer = _this5.m_pendingWriters.splice(0, 1)[0];
                            _writer.close();
                            if (_this5.m_pendingWriters.length) {
                                _this5.m_pendingWriters[0].on('finish', onFinish);
                                _this5.m_pendingWriters[0].bind(_this5);
                            }
                        };
                        if (!this.m_pendingWriters.length) {
                            writer.on('finish', onFinish);
                            writer.bind(this);
                        }
                        this.m_pendingWriters.push(writer);
                    }
                }, {
                    key: "close",
                    value: function () {
                        var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                            var _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, w;

                            return _regenerator2.default.wrap(function _callee7$(_context7) {
                                while (1) {
                                    switch (_context7.prev = _context7.next) {
                                        case 0:
                                            _iteratorNormalCompletion9 = true;
                                            _didIteratorError9 = false;
                                            _iteratorError9 = undefined;
                                            _context7.prev = 3;

                                            for (_iterator9 = (0, _getIterator3.default)(this.m_pendingWriters); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                                w = _step9.value;

                                                w.close();
                                            }
                                            _context7.next = 11;
                                            break;

                                        case 7:
                                            _context7.prev = 7;
                                            _context7.t0 = _context7["catch"](3);
                                            _didIteratorError9 = true;
                                            _iteratorError9 = _context7.t0;

                                        case 11:
                                            _context7.prev = 11;
                                            _context7.prev = 12;

                                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                                _iterator9.return();
                                            }

                                        case 14:
                                            _context7.prev = 14;

                                            if (!_didIteratorError9) {
                                                _context7.next = 17;
                                                break;
                                            }

                                            throw _iteratorError9;

                                        case 17:
                                            return _context7.finish(14);

                                        case 18:
                                            return _context7.finish(11);

                                        case 19:
                                            this.m_pendingWriters = [];
                                            _context7.next = 22;
                                            return (0, _get3.default)(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "close", this).call(this);

                                        case 22:
                                            return _context7.abrupt("return", _context7.sent);

                                        case 23:
                                        case "end":
                                            return _context7.stop();
                                    }
                                }
                            }, _callee7, this, [[3, 7, 11, 19], [12,, 14, 18]]);
                        }));

                        function close() {
                            return _ref8.apply(this, arguments);
                        }

                        return close;
                    }()
                }]);
                return _class;
            }(superClass);
        }
    }, {
        key: "genesisHash",
        set: function set(genesis_hash) {
            this.m_genesis = genesis_hash;
        }
    }, {
        key: "peerid",
        get: function get() {
            return this.m_peerid;
        }
    }]);
    return INode;
}(events_1.EventEmitter);

exports.INode = INode;