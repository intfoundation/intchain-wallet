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
var P2P = require('../../../bdt/p2p/p2p');

var BdtConnection = function (_net_1$IConnection) {
    (0, _inherits3.default)(BdtConnection, _net_1$IConnection);

    function BdtConnection(options) {
        (0, _classCallCheck3.default)(this, BdtConnection);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BdtConnection.__proto__ || (0, _getPrototypeOf2.default)(BdtConnection)).call(this));

        _this.m_nTimeDelta = 0;
        _this.m_bdt_connection = options.bdt_connection;
        _this.m_bdt_connection.on(P2P.Connection.EVENT.drain, function () {
            _this.emit('drain');
        });
        _this.m_bdt_connection.on(P2P.Connection.EVENT.data, function (data) {
            _this.emit('data', data);
        });
        _this.m_bdt_connection.on(P2P.Connection.EVENT.error, function () {
            _this.emit('error', _this, error_code_1.ErrorCode.RESULT_EXCEPTION);
        });
        _this.m_bdt_connection.on(P2P.Connection.EVENT.end, function () {
            // 对端主动关闭了连接，这里先当break一样处理
            // this.emit('error', this, ErrorCode.RESULT_EXCEPTION);
        });
        _this.m_bdt_connection.on(P2P.Connection.EVENT.close, function () {
            _this.emit('close', _this);
        });
        _this.m_remote = options.remote;
        return _this;
    }

    (0, _createClass3.default)(BdtConnection, [{
        key: "send",
        value: function send(data) {
            return this.m_bdt_connection.send(data);
        }
    }, {
        key: "close",
        value: function close() {
            if (this.m_bdt_connection) {
                this.m_bdt_connection.close();
                delete this.m_bdt_connection;
            }
            return _promise2.default.resolve(error_code_1.ErrorCode.RESULT_OK);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            if (this.m_bdt_connection) {
                this.m_bdt_connection.close(true);
                delete this.m_bdt_connection;
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
    return BdtConnection;
}(net_1.IConnection);

exports.BdtConnection = BdtConnection;