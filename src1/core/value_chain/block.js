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
var chain_1 = require("../chain");
var error_code_1 = require("../error_code");

var ValueBlockHeader = function (_chain_1$BlockHeader) {
    (0, _inherits3.default)(ValueBlockHeader, _chain_1$BlockHeader);

    function ValueBlockHeader() {
        (0, _classCallCheck3.default)(this, ValueBlockHeader);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ValueBlockHeader.__proto__ || (0, _getPrototypeOf2.default)(ValueBlockHeader)).call(this));

        _this.m_coinbase = '';
        return _this;
    }

    (0, _createClass3.default)(ValueBlockHeader, [{
        key: "_encodeHashContent",
        value: function _encodeHashContent(writer) {
            var err = (0, _get3.default)(ValueBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueBlockHeader.prototype), "_encodeHashContent", this).call(this, writer);
            if (err) {
                return err;
            }
            try {
                writer.writeVarString(this.m_coinbase);
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_decodeHashContent",
        value: function _decodeHashContent(reader) {
            var err = (0, _get3.default)(ValueBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueBlockHeader.prototype), "_decodeHashContent", this).call(this, reader);
            if (err !== error_code_1.ErrorCode.RESULT_OK) {
                return err;
            }
            try {
                this.m_coinbase = reader.readVarString('utf-8');
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "stringify",
        value: function stringify() {
            var obj = (0, _get3.default)(ValueBlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueBlockHeader.prototype), "stringify", this).call(this);
            obj.coinbase = this.coinbase;
            return obj;
        }
    }, {
        key: "coinbase",
        get: function get() {
            return this.m_coinbase;
        },
        set: function set(coinbase) {
            this.m_coinbase = coinbase;
        }
    }]);
    return ValueBlockHeader;
}(chain_1.BlockHeader);

exports.ValueBlockHeader = ValueBlockHeader;