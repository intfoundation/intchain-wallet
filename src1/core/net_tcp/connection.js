"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

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
var error_code_1 = require("../error_code");
var net_1 = require("../net");

var TcpConnection = function (_net_1$IConnection) {
    (0, _inherits3.default)(TcpConnection, _net_1$IConnection);

    function TcpConnection(options) {
        (0, _classCallCheck3.default)(this, TcpConnection);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TcpConnection.__proto__ || (0, _getPrototypeOf2.default)(TcpConnection)).call(this));

        _this.m_nTimeDelta = 0;
        _this.m_socket = options.socket;
        _this.m_socket.on('drain', function () {
            _this.m_pending = false;
            _this.emit('drain');
        });
        _this.m_socket.on('data', function (data) {
            _this.emit('data', [data]);
        });
        _this.m_socket.on('error', function (err) {
            _this.emit('error', _this, error_code_1.ErrorCode.RESULT_EXCEPTION);
        });
        _this.m_pending = false;
        _this.m_remote = options.remote;
        return _this;
    }

    (0, _createClass3.default)(TcpConnection, [{
        key: "send",
        value: function send(data) {
            if (this.m_pending) {
                return 0;
            } else {
                this.m_pending = !this.m_socket.write(data);
                return data.length;
            }
        }
    }, {
        key: "close",
        value: function close() {
            if (this.m_socket) {
                this.m_socket.removeAllListeners('drain');
                this.m_socket.removeAllListeners('data');
                this.m_socket.removeAllListeners('error');
                this.m_socket.once('error', function () {
                    // do nothing
                });
                this.m_socket.end();
                delete this.m_socket;
            }
            this.emit('close', this);
            return _promise2.default.resolve(error_code_1.ErrorCode.RESULT_OK);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            if (this.m_socket) {
                this.m_socket.removeAllListeners('drain');
                this.m_socket.removeAllListeners('data');
                this.m_socket.removeAllListeners('error');
                this.m_socket.once('error', function () {
                    // do nothing
                });
                this.m_socket.destroy();
                delete this.m_socket;
            }
            return _promise2.default.resolve();
        }
    }, {
        key: "getRemote",
        value: function getRemote() {
            return this.m_remote;
        }
    }, {
        key: "setRemote",
        value: function setRemote(s) {
            this.m_remote = s;
        }
    }, {
        key: "getTimeDelta",
        value: function getTimeDelta() {
            return this.m_nTimeDelta;
        }
    }, {
        key: "setTimeDelta",
        value: function setTimeDelta(n) {
            this.m_nTimeDelta = n;
        }
    }]);
    return TcpConnection;
}(net_1.IConnection);

exports.TcpConnection = TcpConnection;