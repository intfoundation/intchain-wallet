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

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("../error_code");
var events_1 = require("events");

var IConnection = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(IConnection, _events_1$EventEmitte);

    function IConnection() {
        (0, _classCallCheck3.default)(this, IConnection);
        return (0, _possibleConstructorReturn3.default)(this, (IConnection.__proto__ || (0, _getPrototypeOf2.default)(IConnection)).apply(this, arguments));
    }

    (0, _createClass3.default)(IConnection, [{
        key: "on",
        value: function on(event, listener) {
            return (0, _get3.default)(IConnection.prototype.__proto__ || (0, _getPrototypeOf2.default)(IConnection.prototype), "on", this).call(this, event, listener);
        }
    }, {
        key: "once",
        value: function once(event, listener) {
            return (0, _get3.default)(IConnection.prototype.__proto__ || (0, _getPrototypeOf2.default)(IConnection.prototype), "once", this).call(this, event, listener);
        }
    }, {
        key: "send",
        value: function send(data) {
            return 0;
        }
    }, {
        key: "close",
        value: function close() {
            return _promise2.default.resolve(error_code_1.ErrorCode.RESULT_OK);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            return _promise2.default.resolve();
        }
    }, {
        key: "getRemote",
        value: function getRemote() {
            return '';
        }
    }, {
        key: "setRemote",
        value: function setRemote(s) {}
    }, {
        key: "getTimeDelta",
        value: function getTimeDelta() {
            return 0;
        }
    }, {
        key: "setTimeDelta",
        value: function setTimeDelta(n) {}
    }]);
    return IConnection;
}(events_1.EventEmitter);

exports.IConnection = IConnection;