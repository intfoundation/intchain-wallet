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
var error_code_1 = require("../error_code");
var Address = require("../address");
var encoding_1 = require("../lib/encoding");
var writer_1 = require("../lib/writer");
var digest = require("../lib/digest");
function instance(superClass) {
    return function (_superClass) {
        (0, _inherits3.default)(_class, _superClass);

        function _class() {
            (0, _classCallCheck3.default)(this, _class);

            // Uint8Array(33)
            var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this, arguments.length <= 0 ? undefined : arguments[0]));

            _this.m_pubkey = encoding_1.Encoding.ZERO_KEY;
            // Uint8Array(64)
            _this.m_sign = encoding_1.Encoding.ZERO_SIG64;
            return _this;
        }

        (0, _createClass3.default)(_class, [{
            key: "_encodeHashContent",
            value: function _encodeHashContent(writer) {
                var err = (0, _get3.default)(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "_encodeHashContent", this).call(this, writer);
                if (err) {
                    return err;
                }
                try {
                    writer.writeBytes(this.m_pubkey);
                    writer.writeBytes(this.m_sign);
                } catch (e) {
                    return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
                }
                return error_code_1.ErrorCode.RESULT_OK;
            }
        }, {
            key: "_decodeHashContent",
            value: function _decodeHashContent(reader) {
                var err = (0, _get3.default)(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "_decodeHashContent", this).call(this, reader);
                if (err !== error_code_1.ErrorCode.RESULT_OK) {
                    return err;
                }
                this.m_pubkey = reader.readBytes(33);
                this.m_sign = reader.readBytes(64);
                return error_code_1.ErrorCode.RESULT_OK;
            }
        }, {
            key: "signBlock",
            value: function signBlock(secret) {
                this.m_pubkey = Address.publicKeyFromSecretKey(secret);
                var writer = new writer_1.BufferWriter();
                var err = this._encodeSignContent(writer);
                if (err) {
                    return err;
                }
                var content = void 0;
                try {
                    content = writer.render();
                } catch (e) {
                    return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
                }
                var signHash = digest.hash256(content);
                this.m_sign = Address.signBufferMsg(signHash, secret);
                return error_code_1.ErrorCode.RESULT_OK;
            }
        }, {
            key: "_encodeSignContent",
            value: function _encodeSignContent(writer) {
                var err = (0, _get3.default)(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "_encodeHashContent", this).call(this, writer);
                if (err) {
                    return err;
                }
                try {
                    writer.writeBytes(this.m_pubkey);
                } catch (e) {
                    return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
                }
                return error_code_1.ErrorCode.RESULT_OK;
            }
        }, {
            key: "_verifySign",
            value: function _verifySign() {
                var writer = new writer_1.BufferWriter();
                this._encodeSignContent(writer);
                var signHash = digest.hash256(writer.render());
                return Address.verifyBufferMsg(signHash, this.m_sign, this.m_pubkey);
            }
        }, {
            key: "stringify",
            value: function stringify() {
                var obj = (0, _get3.default)(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "stringify", this).call(this);
                obj.creator = Address.addressFromPublicKey(this.m_pubkey);
                return obj;
            }
        }, {
            key: "pubkey",
            get: function get() {
                return this.m_pubkey;
            }
        }, {
            key: "miner",
            get: function get() {
                return Address.addressFromPublicKey(this.m_pubkey);
            }
        }]);
        return _class;
    }(superClass);
}
exports.instance = instance;