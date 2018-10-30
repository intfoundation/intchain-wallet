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

var StandaloneConnection = function (_net_1$IConnection) {
    (0, _inherits3.default)(StandaloneConnection, _net_1$IConnection);

    function StandaloneConnection() {
        (0, _classCallCheck3.default)(this, StandaloneConnection);
        return (0, _possibleConstructorReturn3.default)(this, (StandaloneConnection.__proto__ || (0, _getPrototypeOf2.default)(StandaloneConnection)).apply(this, arguments));
    }

    (0, _createClass3.default)(StandaloneConnection, [{
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
        key: "getRemote",
        value: function getRemote() {
            return '';
        }
    }]);
    return StandaloneConnection;
}(net_1.IConnection);

exports.StandaloneConnection = StandaloneConnection;