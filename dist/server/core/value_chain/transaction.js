"use strict";

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
var bignumber_js_1 = require("bignumber.js");
var Transaction = require("../block/transaction").Transaction;
var serializable_1 = require("../serializable");

var ValueTransaction = function (_Transaction) {
    (0, _inherits3.default)(ValueTransaction, _Transaction);

    function ValueTransaction() {
        (0, _classCallCheck3.default)(this, ValueTransaction);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ValueTransaction.__proto__ || (0, _getPrototypeOf2.default)(ValueTransaction)).call(this));

        _this.m_value = new bignumber_js_1.BigNumber(0);
        // this.m_fee = new BigNumber(0);
        _this.m_limit = new bignumber_js_1.BigNumber(0);
        _this.m_price = new bignumber_js_1.BigNumber(0);
        return _this;
    }

    (0, _createClass3.default)(ValueTransaction, [{
        key: "_encodeHashContent",
        value: function _encodeHashContent(writer) {
            var err = (0, _get3.default)(ValueTransaction.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueTransaction.prototype), "_encodeHashContent", this).call(this, writer);
            if (err) {
                return err;
            }
            writer.writeBigNumber(this.m_value);
            // writer.writeBigNumber(this.m_fee);
            writer.writeBigNumber(this.m_limit);
            writer.writeBigNumber(this.m_price);
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_decodeHashContent",
        value: function _decodeHashContent(reader) {
            var err = (0, _get3.default)(ValueTransaction.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueTransaction.prototype), "_decodeHashContent", this).call(this, reader);
            if (err) {
                return err;
            }
            try {
                this.m_value = reader.readBigNumber();
                // this.m_fee = reader.readBigNumber();
                this.m_limit = reader.readBigNumber();
                this.m_price = reader.readBigNumber();
            } catch (e) {
                return serializable_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "stringify",
        value: function stringify() {
            var obj = (0, _get3.default)(ValueTransaction.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueTransaction.prototype), "stringify", this).call(this);
            obj.value = this.value.toString();
            // obj.fee = this.fee.toString();
            obj.limit = this.limit.toString();
            obj.price = this.price.toString();
            return obj;
        }
    }, {
        key: "value",
        get: function get() {
            return this.m_value;
        },
        set: function set(value) {
            this.m_value = value;
        }
        // get fee(): BigNumber {
        //     return this.m_fee;
        // }
        //
        // set fee(value: BigNumber) {
        //     this.m_fee = value;
        // }

    }, {
        key: "limit",
        get: function get() {
            return this.m_limit;
        },
        set: function set(l) {
            this.m_limit = l;
        }
    }, {
        key: "price",
        get: function get() {
            return this.m_price;
        },
        set: function set(p) {
            this.m_price = p;
        }
    }]);
    return ValueTransaction;
}(Transaction);

exports.ValueTransaction = ValueTransaction;