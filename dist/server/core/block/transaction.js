"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

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
var serializable_1 = require("../serializable");
var encoding_1 = require("../lib/encoding");
var Address = require("../address");

var Transaction = function (_serializable_1$Seria) {
    (0, _inherits3.default)(Transaction, _serializable_1$Seria);

    function Transaction() {
        (0, _classCallCheck3.default)(this, Transaction);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Transaction.__proto__ || (0, _getPrototypeOf2.default)(Transaction)).call(this));

        _this.m_publicKey = encoding_1.Encoding.ZERO_KEY;
        _this.m_signature = encoding_1.Encoding.ZERO_SIG64;
        _this.m_method = '';
        _this.m_nonce = -1;
        return _this;
    }

    (0, _createClass3.default)(Transaction, [{
        key: "verifySignature",

        /**
         *  virtual验证交易的签名段
         */
        value: function verifySignature() {
            if (!this.m_publicKey) {
                return false;
            }
            return Address.verify(this.m_hash, this.m_signature, this.m_publicKey);
        }
    }, {
        key: "sign",
        value: function sign(privateKey) {
            var pubkey = Address.publicKeyFromSecretKey(privateKey);
            this.m_publicKey = pubkey;
            this.updateHash();
            this.m_signature = Address.sign(this.m_hash, privateKey);
        }
    }, {
        key: "_encodeHashContent",
        value: function _encodeHashContent(writer) {
            try {
                writer.writeVarString(this.m_method);
                writer.writeU32(this.m_nonce);
                writer.writeBytes(this.m_publicKey);
                this._encodeInput(writer);
            } catch (e) {
                return serializable_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "encode",
        value: function encode(writer) {
            var err = (0, _get3.default)(Transaction.prototype.__proto__ || (0, _getPrototypeOf2.default)(Transaction.prototype), "encode", this).call(this, writer);
            if (err) {
                return err;
            }
            try {
                writer.writeBytes(this.m_signature);
            } catch (e) {
                return serializable_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_decodeHashContent",
        value: function _decodeHashContent(reader) {
            try {
                this.m_method = reader.readVarString();
                this.m_nonce = reader.readU32();
                this.m_publicKey = reader.readBytes(33, false);
                this._decodeInput(reader);
            } catch (e) {
                return serializable_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            var err = (0, _get3.default)(Transaction.prototype.__proto__ || (0, _getPrototypeOf2.default)(Transaction.prototype), "decode", this).call(this, reader);
            if (err) {
                return err;
            }
            try {
                this.m_signature = reader.readBytes(64, false);
            } catch (e) {
                return serializable_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_encodeInput",
        value: function _encodeInput(writer) {
            var input = void 0;
            if (this.m_input) {
                input = (0, _stringify2.default)(serializable_1.toStringifiable(this.m_input, true));
            } else {
                input = (0, _stringify2.default)({});
            }
            writer.writeVarString(input);
            return writer;
        }
    }, {
        key: "_decodeInput",
        value: function _decodeInput(reader) {
            this.m_input = serializable_1.fromStringifiable(JSON.parse(reader.readVarString()));
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "stringify",
        value: function stringify() {
            var obj = (0, _get3.default)(Transaction.prototype.__proto__ || (0, _getPrototypeOf2.default)(Transaction.prototype), "stringify", this).call(this);
            obj.method = this.method;
            obj.input = this.input;
            obj.nonce = this.nonce;
            obj.caller = this.address;
            return obj;
        }
    }, {
        key: "address",
        get: function get() {
            return Address.addressFromPublicKey(this.m_publicKey);
        }
    }, {
        key: "method",
        get: function get() {
            return this.m_method;
        },
        set: function set(s) {
            this.m_method = s;
        }
    }, {
        key: "nonce",
        get: function get() {
            return this.m_nonce;
        },
        set: function set(n) {
            this.m_nonce = n;
        }
    }, {
        key: "input",
        get: function get() {
            var input = this.m_input;
            return input;
        },
        set: function set(i) {
            this.m_input = i;
        }
    }]);
    return Transaction;
}(serializable_1.SerializableWithHash);

exports.Transaction = Transaction;

var EventLog = function () {
    function EventLog() {
        (0, _classCallCheck3.default)(this, EventLog);

        this.m_event = '';
    }

    (0, _createClass3.default)(EventLog, [{
        key: "encode",
        value: function encode(writer) {
            var input = void 0;
            try {
                if (this.m_params) {
                    input = (0, _stringify2.default)(serializable_1.toStringifiable(this.m_params, true));
                } else {
                    input = (0, _stringify2.default)({});
                }
                writer.writeVarString(input);
            } catch (e) {
                return serializable_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            try {
                this.m_params = serializable_1.fromStringifiable(JSON.parse(reader.readVarString()));
            } catch (e) {
                return serializable_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "stringify",
        value: function stringify() {
            var obj = (0, _create2.default)(null);
            obj.name = this.name;
            obj.param = this.param;
            return obj;
        }
    }, {
        key: "name",
        set: function set(n) {
            this.m_event = n;
        },
        get: function get() {
            return this.m_event;
        }
    }, {
        key: "param",
        set: function set(p) {
            this.m_params = p;
        },
        get: function get() {
            var param = this.m_params;
            return param;
        }
    }]);
    return EventLog;
}();

exports.EventLog = EventLog;

var Receipt = function () {
    function Receipt() {
        (0, _classCallCheck3.default)(this, Receipt);

        this.m_transactionHash = '';
        this.m_returnCode = 0;
        this.m_eventLogs = new Array();
    }

    (0, _createClass3.default)(Receipt, [{
        key: "encode",
        value: function encode(writer) {
            try {
                writer.writeVarString(this.m_transactionHash);
                writer.writeI32(this.m_returnCode);
                writer.writeU16(this.m_eventLogs.length);
            } catch (e) {
                return serializable_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.m_eventLogs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var log = _step.value;

                    var err = log.encode(writer);
                    if (err) {
                        return err;
                    }
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

            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            this.m_transactionHash = reader.readVarString();
            this.m_returnCode = reader.readI32();
            var nCount = reader.readU16();
            for (var i = 0; i < nCount; i++) {
                var log = new EventLog();
                var err = log.decode(reader);
                if (err) {
                    return err;
                }
                this.m_eventLogs.push(log);
            }
            return serializable_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "stringify",
        value: function stringify() {
            var obj = (0, _create2.default)(null);
            obj.transactionHash = this.m_transactionHash;
            obj.returnCode = this.m_returnCode;
            obj.logs = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(this.eventLogs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var l = _step2.value;

                    obj.logs.push(l.stringify());
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

            return obj;
        }
    }, {
        key: "transactionHash",
        set: function set(s) {
            this.m_transactionHash = s;
        },
        get: function get() {
            return this.m_transactionHash;
        }
    }, {
        key: "returnCode",
        set: function set(n) {
            this.m_returnCode = n;
        },
        get: function get() {
            return this.m_returnCode;
        }
    }, {
        key: "eventLogs",
        set: function set(logs) {
            this.m_eventLogs = logs;
        },
        get: function get() {
            var l = this.m_eventLogs;
            return l;
        }
    }]);
    return Receipt;
}();

exports.Receipt = Receipt;