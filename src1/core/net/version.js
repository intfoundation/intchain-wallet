"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("../error_code");
var MAIN_VERSION = '1.2.3.4';

var Version = function () {
    function Version() {
        (0, _classCallCheck3.default)(this, Version);

        this.m_genesis = '';
        this.m_mainVersion = MAIN_VERSION;
        this.m_timestamp = Date.now();
        this.m_peerid = '';
        this.m_random = 1000000 * Math.random();
    }

    (0, _createClass3.default)(Version, [{
        key: "compare",
        value: function compare(other) {
            if (this.m_timestamp > other.m_timestamp) {
                return 1;
            } else if (this.m_timestamp < other.m_timestamp) {
                return -1;
            }
            if (this.m_random > other.m_random) {
                return 1;
            } else if (this.m_random > other.m_random) {
                return -1;
            }
            return 0;
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            try {
                this.m_timestamp = reader.readU64();
                this.m_peerid = reader.readVarString();
                this.m_genesis = reader.readVarString();
                this.m_mainVersion = reader.readVarString();
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "encode",
        value: function encode(writer) {
            try {
                writer.writeU64(this.m_timestamp);
                writer.writeVarString(this.m_peerid);
                writer.writeVarString(this.m_genesis);
                writer.writeVarString(this.m_mainVersion);
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "isSupport",
        value: function isSupport() {
            return true;
        }
    }, {
        key: "mainversion",
        set: function set(v) {
            this.m_mainVersion = v;
        },
        get: function get() {
            return this.m_mainVersion;
        }
    }, {
        key: "timestamp",
        get: function get() {
            return this.m_timestamp;
        }
    }, {
        key: "genesis",
        set: function set(genesis) {
            this.m_genesis = genesis;
        },
        get: function get() {
            return this.m_genesis;
        }
    }, {
        key: "peerid",
        set: function set(p) {
            this.m_peerid = p;
        },
        get: function get() {
            return this.m_peerid;
        }
    }]);
    return Version;
}();

exports.Version = Version;