"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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
var chain_1 = require("../chain");
var chain_2 = require("./chain");
var assert = require('assert');

var ValueMiner = function (_chain_1$Miner) {
    (0, _inherits3.default)(ValueMiner, _chain_1$Miner);

    function ValueMiner(options) {
        (0, _classCallCheck3.default)(this, ValueMiner);
        return (0, _possibleConstructorReturn3.default)(this, (ValueMiner.__proto__ || (0, _getPrototypeOf2.default)(ValueMiner)).call(this, options));
    }

    (0, _createClass3.default)(ValueMiner, [{
        key: "_chainInstance",
        value: function _chainInstance() {
            return new chain_2.ValueChain({ logger: this.m_logger });
        }
    }, {
        key: "parseInstanceOptions",
        value: function parseInstanceOptions(node, instanceOptions) {
            var _get$call = (0, _get3.default)(ValueMiner.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueMiner.prototype), "parseInstanceOptions", this).call(this, node, instanceOptions),
                err = _get$call.err,
                value = _get$call.value;

            if (err) {
                return { err: err };
            }
            value.coinbase = instanceOptions.get('coinbase');
            return { err: error_code_1.ErrorCode.RESULT_OK, value: value };
        }
    }, {
        key: "initialize",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (options.coinbase) {
                                    this.m_coinbase = options.coinbase;
                                }
                                return _context.abrupt("return", (0, _get3.default)(ValueMiner.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValueMiner.prototype), "initialize", this).call(this, options));

                            case 2:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function initialize(_x) {
                return _ref.apply(this, arguments);
            }

            return initialize;
        }()
    }, {
        key: "_decorateBlock",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(block) {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                block.header.coinbase = this.m_coinbase;
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _decorateBlock(_x2) {
                return _ref2.apply(this, arguments);
            }

            return _decorateBlock;
        }()
    }, {
        key: "coinbase",
        set: function set(address) {
            this.m_coinbase = address;
        },
        get: function get() {
            return this.m_coinbase;
        }
    }, {
        key: "chain",
        get: function get() {
            return this.m_chain;
        }
    }]);
    return ValueMiner;
}(chain_1.Miner);

exports.ValueMiner = ValueMiner;