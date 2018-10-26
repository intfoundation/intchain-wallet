"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

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
var net_1 = require("net");
var net_2 = require("../net");
var connection_1 = require("./connection");
var assert = require('assert');

var TcpNode = function (_net_2$INode) {
    (0, _inherits3.default)(TcpNode, _net_2$INode);

    function TcpNode(options) {
        (0, _classCallCheck3.default)(this, TcpNode);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TcpNode.__proto__ || (0, _getPrototypeOf2.default)(TcpNode)).call(this, { peerid: options.peerid, logger: options.logger, loggerOptions: options.loggerOptions }));

        _this.m_options = (0, _create2.default)(null);
        (0, _assign2.default)(_this.m_options, options);
        _this.m_server = new net_1.Server();
        return _this;
    }

    (0, _createClass3.default)(TcpNode, [{
        key: "_peeridToIpAddress",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(peerid) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });

                            case 1:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _peeridToIpAddress(_x) {
                return _ref.apply(this, arguments);
            }

            return _peeridToIpAddress;
        }()
    }, {
        key: "_connectTo",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(peerid) {
                var _this2 = this;

                var par, tcp;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this._peeridToIpAddress(peerid);

                            case 2:
                                par = _context2.sent;

                                if (!par.err) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt("return", { err: par.err });

                            case 5:
                                tcp = new net_1.Socket();
                                return _context2.abrupt("return", new _promise2.default(function (resolve, reject) {
                                    tcp.once('error', function (e) {
                                        tcp.removeAllListeners('connect');
                                        resolve({ err: error_code_1.ErrorCode.RESULT_EXCEPTION });
                                    });
                                    tcp.connect(par.ip);
                                    tcp.once('connect', function () {
                                        var connNodeType = _this2._nodeConnectionType();
                                        var connNode = new connNodeType(_this2, { socket: tcp, remote: peerid });
                                        tcp.removeAllListeners('error');
                                        tcp.on('error', function (e) {
                                            _this2.emit('error', connNode, error_code_1.ErrorCode.RESULT_EXCEPTION);
                                        });
                                        resolve({ err: error_code_1.ErrorCode.RESULT_OK, conn: connNode });
                                    });
                                }));

                            case 7:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _connectTo(_x2) {
                return _ref2.apply(this, arguments);
            }

            return _connectTo;
        }()
    }, {
        key: "_connectionType",
        value: function _connectionType() {
            return connection_1.TcpConnection;
        }
    }, {
        key: "uninit",
        value: function uninit() {
            var _this3 = this;

            var closeServerOp = void 0;
            if (this.m_server) {
                closeServerOp = new _promise2.default(function (resolve) {
                    _this3.m_server.close(resolve);
                });
            }
            if (closeServerOp) {
                return _promise2.default.all([closeServerOp, (0, _get3.default)(TcpNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(TcpNode.prototype), "uninit", this).call(this)]);
            } else {
                return (0, _get3.default)(TcpNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(TcpNode.prototype), "uninit", this).call(this);
            }
        }
    }, {
        key: "listen",
        value: function listen() {
            var _this4 = this;

            return new _promise2.default(function (resolve, reject) {
                _this4.m_server.listen(_this4.m_options.port, _this4.m_options.host);
                _this4.m_server.once('listening', function () {
                    _this4.m_server.removeAllListeners('error');
                    _this4.m_server.on('connection', function (tcp) {
                        var connNodeType = _this4._nodeConnectionType();
                        var connNode = new connNodeType(_this4, { socket: tcp, remote: tcp.remoteAddress + ":" + tcp.remotePort });
                        tcp.on('error', function (e) {
                            _this4.emit('error', connNode, error_code_1.ErrorCode.RESULT_EXCEPTION);
                        });
                        _this4._onInbound(connNode);
                    });
                    resolve(error_code_1.ErrorCode.RESULT_OK);
                });
                _this4.m_server.once('error', function (e) {
                    _this4.m_server.removeAllListeners('listening');
                    resolve(error_code_1.ErrorCode.RESULT_EXCEPTION);
                });
            });
        }
    }]);
    return TcpNode;
}(net_2.INode);

exports.TcpNode = TcpNode;