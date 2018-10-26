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
var bignumber_js_1 = require("bignumber.js");
var chain_1 = require("../chain");

var ValueHandler = function (_chain_1$BaseHandler) {
    (0, _inherits3.default)(ValueHandler, _chain_1$BaseHandler);

    function ValueHandler() {
        (0, _classCallCheck3.default)(this, ValueHandler);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ValueHandler.__proto__ || (0, _getPrototypeOf2.default)(ValueHandler)).call(this));

        _this.m_minerWage = function (height) {
            return _promise2.default.resolve(new bignumber_js_1.BigNumber(1));
        };
        return _this;
    }

    (0, _createClass3.default)(ValueHandler, [{
        key: "onMinerWage",
        value: function onMinerWage(l) {
            if (l) {
                this.m_minerWage = l;
            }
        }
    }, {
        key: "getMinerWageListener",
        value: function getMinerWageListener() {
            return this.m_minerWage;
        }
    }]);
    return ValueHandler;
}(chain_1.BaseHandler);

exports.ValueHandler = ValueHandler;